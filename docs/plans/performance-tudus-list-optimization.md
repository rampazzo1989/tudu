# Plano de Otimização de Performance das Listas de Tudús

Este documento detalha o diagnóstico completo dos problemas de performance (jittering, lentidão a partir de 15 itens) e propõe um plano de arquitetura e refatoração para alcançar 60 FPS estáveis na rolagem, mantendo todas as funcionalidades atuais: **arrastar e soltar (drag & drop)**, **itens de altura variável**, **seções dinâmicas**, **swipe horizontal bidirecional com animações ativas** e **seção de concluídos**.

---

## 1. Diagnóstico dos Gargalos Atuais

Após análise aprofundada da base de código (`src/components/tudus-list`, `src/components/tudu-card`, `src/components/swipeable-card`, `src/components/animated-icons`), identificamos 5 causas raízes que explicam por que a lista sofre com engasgos graves já com 15 itens:

### Causa 1: A Armadilha das Listas Aninhadas (`NestableScrollContainer` + `NestableDraggableFlatList` + `LegendList`)
- Em `TudusList` (`src/components/tudus-list/index.tsx`), a estrutura atual aninha duas listas virtualizadas dentro de um `NestableScrollContainer` (ScrollView externo do Gesture Handler):
  - Itens a fazer: `<NestableDraggableFlatList>` com `removeClippedSubviews={false}` e `windowSize={10}`.
  - Itens feitos: `<LegendList>` com `removeClippedSubviews` e `nestedScrollEnabled`.
- **Efeito**: Quando uma `FlatList` está aninhada dentro de um `ScrollView`, ela perde a noção real da janela de viewport do scroll. Como consequência, **a virtualização é praticamente anulada**: o React Native instancia quase todos os itens na memória/layout nativo de uma só vez. Além disso, dois sistemas de scroll/virtualização disputam a medição de layout (`onLayout`) no mesmo container.

### Causa 2: Sobrecarga de Lotties em Repouso vs Lotties Animados em Interação
- Cada card e suas opções ocultas de swipe renderizam de 6 a 8 componentes baseados em Lottie nativo:
  1. `Star`: Lottie (`star-white.json`) montado permanentemente em cada card.
  2. `TuduCheckbox`: Lottie (`tudu_checkbox.json`) montado permanentemente em cada card.
  3. `ChipsRow` (quando há data/recorrência): Ícones de chip como `SunIcon`, `ListDefaultIcon`, `CalendarIcon` carregando motores Lottie completos apenas para renderizar uma imagem estática minúscula (10px a 12px)!
  4. Por trás do card, no `SwipeableCard`:
     - Ações à esquerda: `SunIcon` ou `UndoSunIcon` (animado via `handleSwipeableStartDrag('left')` quando o usuário arrasta para a direita).
     - Ações à direita: `DeleteIcon` (animado via `handleSwipeableStartDrag('right')` quando o usuário arrasta para a esquerda), `RenameIcon` e `CalendarIcon` (exibição estática em repouso nos frames 70 e 60).
- **Efeito**: Com a virtualização quebrada, ter **90 a 120 instâncias nativas de Lottie** alocadas simultaneamente sobrecarrega a GPU e UI Thread durante a rolagem rápida, mesmo que quase todas estejam 100% paradas.

### Causa 3: Memoização Quebrada e Re-renderizações em Cascata
- Em `TudusList`:
  - `SwipeableTudu` é declarado como componente mas invocado como função: `{SwipeableTudu({ tudu, isActive })}` em vez de `<SwipeableTudu ... />`.
  - Passa funções criadas inline a cada ciclo de render: `handleDeleteGenerator(tudu)`, `handleEditGenerator(tudu)`, `handleScheduleGenerator(tudu)`, `handleSendToOrRemoveFromTodayGenerator(tudu)` e `onPress={() => onTuduPress(tudu)}`.
  - Com isso, o `React.memo` de `SwipeableTuduCard`, `SwipeableCard` e `TuduCard` é completamente anulado: **qualquer alteração de estado ou frame de scroll força o recálculo do JSX de todos os itens**.
- Em `TudusList`:
  - `key={`draggable-list-${dragVersion}`}`: a cada fim de arraste (`handleDragEnd`), o `dragVersion` é incrementado, destruindo a lista inteira e remontando-a do zero!

### Causa 4: Conflito Massivo de Gestures na Thread UI
- Em cada linha existem múltiplos `GestureHandlers` concorrendo simultaneamente:
  - `ScrollView` pan handler (rolagem vertical)
  - `DraggableFlatList` pan/long-press handler (arraste vertical)
  - `Swipeable` pan handler (deslize horizontal)
  - `ShrinkableView` touchable handler (escala no toque)
  - `TouchableOpacity` internos (estrela e checkbox)
- Com todos os itens montados sem virtualização, dezenas de gesture handlers competem ativamente por eventos de toque.

### Causa 5: Sobrecarga de `styled-components` em Linhas de Lista
- `Card`, `CheckAndTextContainer`, `Label`, `LabelAndAdditionalInfoContainer`, `ChipsRow`, `StarContainer` usam `styled-components/native`.
- `styled-components` v5 em React Native analisa template literals e gera folhas de estilo dinâmicas em runtime no JS thread a cada re-renderização.

---

## 2. Análise de Bibliotecas: Trocar ou Refatorar?

| Opção | Viabilidade com Drag & Drop + Altura Variável + Swipe | Avaliação |
| :--- | :--- | :--- |
| **Opção 1: Migrar para Shopify FlashList** | ❌ Incompatível | O `FlashList` **não suporta nativamente Drag & Drop**. Tentativas de usar wrappers de terceiros com itens de altura dinâmica no React Native 0.77 quebram cálculos de offset e causam pulos visuais severos. Não atende aos requisitos. |
| **Opção 2: Migrar para `react-native-reorderable-list`** | ⚠️ Risco Médio | Biblioteca mais recente baseada em Reanimated, mas menos estável com alturas dinâmicas extremas, seções misturadas e dropzones vazias. |
| **Opção 3: Otimizar e Unificar a `react-native-draggable-flatlist` (Recomendado)** | ✅ Excelente | A biblioteca já usa Reanimated 3 e Gesture Handler 2 e lida perfeitamente com alturas variáveis nativamente via `onLayout`. O problema **nunca foi o algoritmo de drag**, mas sim o fato de estar presa dentro de um `NestableScrollContainer` com 100+ Lotties em repouso e sem virtualização. |

> **Veredito**: Manter a `react-native-draggable-flatlist`, transformando-a na lista raiz de tela cheia, e tratar a sobrecarga de Lotties separando o que é estático do que é animado sob demanda.

---

## 3. Matriz Precisa de Ícones: Estáticos (SVG) vs Animados (Lottie)

Conforme solicitado, separamos com rigor o que deve ser **SVG estático fiel** (extraído da posição exata do Lottie atual) do que deve **manter a animação fluida** quando acionado pelo usuário:

| Componente / Ícone | Contexto de Uso | Estado em Repouso (Rolagem) | Comportamento na Interação do Usuário | Posição / Frames Exatos do Lottie Original |
| :--- | :--- | :--- | :--- | :--- |
| **`Star` (Favoritar)** | Botão de estrela no card | **SVG Estático Leve**: <br/>- Se desmarcado: Estrela outline vazia (opacidade 0.2)<br/>- Se marcado: Estrela preenchida (cor do tema `theme.colors.star`) | **Substituição Dinâmica por Lottie**: <br/>Ao tocar na estrela, monta temporariamente o Lottie:<br/>- **Favoritar**: toca de `530` a `600`<br/>- **Desfavoritar**: toca de `600` a `530`<br/>Ao finalizar (`onAnimationFinish`), desmonta o Lottie e volta para o SVG correspondente. | Arquivo: `star-white.json`<br/>• Desmarcado: Frame `530`<br/>• Marcado: Frame `600` |
| **`TuduCheckbox`** | Checkbox de conclusão no card | **SVG Estático Leve**: <br/>- Se a fazer: Círculo vazio<br/>- Se feito: Círculo preenchido com checkmark | **Substituição Dinâmica por Lottie**: <br/>Ao tocar no checkbox, monta o Lottie:<br/>- **Marcar**: toca de `0` a `32`<br/>- **Desmarcar**: toca de `32` a `81`<br/>Ao finalizar, volta para SVG estático. | Arquivo: `tudu_checkbox.json`<br/>• Marcado: Frame `32`<br/>• Desmarcado: Frame `81` |
| **`SunIcon` / `UndoSunIcon`** | Ação esquerda no swipe ("Enviar/Remover de Hoje") | Oculto sob o card em repouso | **MANTÉM ANIMAÇÃO LOTTIE**: <br/>Ao arrastar o card para a direita (`handleSwipeableStartDrag('left')`), o Lottie toca sua animação suavemente (`playAnimation()`) exatamente como hoje. | Arquivo: `sun.json` / `undo-sun.json`<br/>Animação de transição solar completa |
| **`DeleteIcon`** | Ação direita no swipe (Excluir) | Oculto sob o card em repouso | **MANTÉM ANIMAÇÃO LOTTIE**: <br/>Ao arrastar o card para a esquerda (`handleSwipeableStartDrag('right')`), o `DeleteIcon` (último ícone) anima a tampa da lixeira abrindo (`playAnimation()`). | Arquivo: `trash2.json`<br/>• Repouso: Frame `80`<br/>• Ação de swipe: toca de `80` a `150` |
| **`RenameIcon`** | Ação direita no swipe (Renomear) | Oculto sob o card em repouso | **SVG Estático Fiel**: <br/>Como fica no meio e não é disparado automaticamente no início do drag de swipe, usa SVG correspondente ao lápis estático do frame 70. | Arquivo: `rename.json`<br/>• Frame estático: `70` |
| **`CalendarIcon` (Swipe)** | Ação direita no swipe (Agendar) | Oculto sob o card em repouso | **SVG Estático Fiel**: <br/>Exibe o SVG correspondente ao calendário estático no frame 60. | Arquivo: `calendar_black.json`<br/>• Frame estático: `60` |
| **`ChipsRow` (Data / Hoje)** | Chip de data em `TuduCard` | **100% SVG Estático**: <br/>Substitui `<SunIcon size={12} />` e `<CalendarIcon size={11} />` por SVGs estáticos fiéis. | Nenhuma (chips não executam animação). | Extraídos de `sun.json` e `calendar_black.json` |
| **`ChipsRow` (Lista Origem)** | Chip de lista em `TuduCard` | **100% SVG Estático**: <br/>Substitui `<ListDefaultIcon size={10} />` por SVG estático das 3 linhas/bullets. | Nenhuma (apenas tag de texto com ícone). | Arquivo: `list_icon.json`<br/>• Frame estático: `165` |
| **`RecurrenceIcon`** | Chip de recorrência em `TuduCard` | Mantido Lottie (só aparece em tarefas recorrentes com autoPlay) ou SVG estático. | Animação sutil de ciclo. | Arquivo: `recurrence.lottie` |

---

## 4. Detalhamento da Mecânica do `Star` (Estático com Substituição sob Demanda)

Como destacado pelo usuário, a estrela precisa de um cuidado cirúrgico com os frames exatos:

- Frames: `CHECKED_FRAME = 600`, `UNCHECKED_FRAME = 530`.
- Em repouso (durante a rolagem da lista): renderiza SVG estático com opacidade 0.2 (desmarcado) ou estrela preenchida dourada (marcado). Zero instâncias de Lottie ativas na rolagem.
- Ao interagir (toque no botão):
  - Monta o Lottie temporário.
  - Se desmarcado -> marcado: toca de 530 a 600.
  - Se marcado -> desmarcado: toca de 600 a 530.
  - No `onAnimationFinish`, desmonta o Lottie e volta para o SVG estático no estado resultante.

---

## 5. Arquitetura de Unificação da Lista (`DraggableFlatList` Raiz)

1. **Eliminação do `NestableScrollContainer` e `LegendList`**:
   - Substituir `NestableDraggableFlatList` por `DraggableFlatList` padrão como container de scroll raiz da tela.
   - Passar `TopComponent` diretamente para `ListHeaderComponent` da `DraggableFlatList`.

2. **Modelo Unificado de Dados (`flatRows`)**:
   - Integrar os itens ativos e a seção de concluídos no mesmo array de dados:
     - `type: 'section_header'`
     - `type: 'empty_section_dropzone'`
     - `type: 'tudu'` (não-concluído, arrastável)
     - `type: 'done_header'` (título "Concluídos" com menu e reação de comemoração)
     - `type: 'done_tudu'` (concluído, não arrastável com `drag={undefined}`)
   - Isso permite que o mecanismo de virtualização nativo (`removeClippedSubviews={true}`, `windowSize={5}`) gerencie a janela visível de toda a tela em uma única thread de rolagem suave.

3. **Memoização e `StyleSheet.create`**:
   - Extrair o card de tudú em um componente isolado memoizado (`TuduListRowItem`), com comparador `arePropsEqual` avaliando somente propriedades essenciais (`id`, `done`, `starred`, `label`, `dueDate`, `recurrence`, `sectionId`, `isActive`).
   - Callbacks no container pai estáveis recebendo `id` (ex: `onDelete(id)`, `onToggle(id)`, `onStar(id)`), eliminando todos os geradores dinâmicos (`handleDeleteGenerator`).
   - Migrar estilos internos de `styled-components` para `StyleSheet.create`, eliminando o overhead de interpolação CSS em runtime.

---

## 6. Arquivos Impactados na Execução

### [Componente: Ícones e SVGs]
- `src/assets/static/tudu-icons/index.tsx` [NEW]: SVGs estáticos fiéis extraídos dos frames de repouso dos Lotties.
- `src/components/star/index.tsx` [MODIFY]: SVG estático em repouso + Lottie temporário nos frames 530 ⇄ 600 no toque.
- `src/components/tudu-checkbox/index.tsx` [MODIFY]: SVG estático em repouso + Lottie temporário nos frames 0 ⇄ 32 ⇄ 81 no toque.

### [Componente: Swipe e Cards]
- `src/components/swipeable-card/index.tsx` [MODIFY]: Preservação da animação no arrasto para a direita (`SunIcon` / `UndoSunIcon`) e para a esquerda (`DeleteIcon`); uso de SVGs estáticos para `RenameIcon` e `CalendarIcon`.
- `src/components/tudu-card/index.tsx` [MODIFY]: Substituição dos ícones Lottie dos chips por SVGs estáticos; migração para `StyleSheet.create`.

### [Componente: Lista Principal]
- `src/components/tudus-list/index.tsx` [MODIFY]: Desaninhamento, adoção de `DraggableFlatList` raiz com `ListHeaderComponent` para `TopComponent`, inclusão dos concluídos no pipeline unificado, ativação de `removeClippedSubviews={true}` e `windowSize={5}`, remoção de `key` dinâmico.
- `src/components/tudus-list/tudu-list-row-item.tsx` [NEW]: Linha individual memoizada com callbacks estáveis por ID.
