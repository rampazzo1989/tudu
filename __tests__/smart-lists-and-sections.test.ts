jest.mock('react-dom', () => ({}), { virtual: true });

import {
  buildParseListPrompt,
  buildReorderListPrompt,
  parseListResultFromResponse,
} from '../src/service/ai/ai-service';
import { Section, TuduItem, TuduViewModel, ListViewModel, cloneList } from '../src/scenes/home/types';

describe('Smart Lists & Sections', () => {
  describe('buildParseListPrompt', () => {
    it('generates prompt for orderingType none', () => {
      const prompt = buildParseListPrompt('Maçã\nBanana', 'none');
      expect(prompt).toContain('Maçã\nBanana');
      expect(prompt).toContain('Mantenha a ordem dos itens fiel à sequência');
    });

    it('generates prompt for orderingType smart', () => {
      const prompt = buildParseListPrompt('Maçã\nBanana\nDetergente', 'smart');
      expect(prompt).toContain('Agrupamento e Ordenação Inteligente');
      expect(prompt).toContain('Identifique o contexto dos itens informados');
      expect(prompt).toContain('seções temáticas');
    });

    it('generates prompt for orderingType custom with customPrompt', () => {
      const prompt = buildParseListPrompt(
        'Maçã\nBanana',
        'custom',
        'Mercado Assaí, primeira seção é hortifruti',
      );
      expect(prompt).toContain('Mercado Assaí, primeira seção é hortifruti');
      expect(prompt).toContain('Agrupamento e Ordenação Personalizadas');
    });
  });

  describe('parseListResultFromResponse', () => {
    it('parses JSON with title, sections, and items correctly', () => {
      const rawJson = JSON.stringify({
        title: '🛒 Compras de Mercado',
        sections: [
          {
            title: '🥦 Hortifruti',
            items: ['🍌 Banana', '🍎 Maçã'],
          },
          {
            title: '🧼 Limpeza',
            items: ['🧴 Detergente'],
          },
        ],
        items: ['🍌 Banana', '🍎 Maçã', '🧴 Detergente'],
      });

      const result = parseListResultFromResponse(rawJson);
      expect(result.title).toBe('🛒 Compras de Mercado');
      expect(result.sections).toHaveLength(2);
      expect(result.sections?.[0].title).toBe('🥦 Hortifruti');
      expect(result.sections?.[0].items).toEqual(['🍌 Banana', '🍎 Maçã']);
      expect(result.sections?.[1].title).toBe('🧼 Limpeza');
      expect(result.sections?.[1].items).toEqual(['🧴 Detergente']);
      expect(result.items).toEqual(['🍌 Banana', '🍎 Maçã', '🧴 Detergente']);
    });

    it('parses JSON with only sections when items array is missing', () => {
      const rawJson = JSON.stringify({
        title: '🛒 Compras',
        sections: [
          {
            title: '🥦 Hortifruti',
            items: ['🍌 Banana'],
          },
        ],
      });

      const result = parseListResultFromResponse(rawJson);
      expect(result.title).toBe('🛒 Compras');
      expect(result.sections).toHaveLength(1);
      expect(result.items).toEqual(['🍌 Banana']);
    });

    it('falls back gracefully on non-json text', () => {
      const rawText = '• 🍌 Banana\n• 🍎 Maçã';
      const result = parseListResultFromResponse(rawText);
      expect(result.title).toBe('📝 Lista');
      expect(result.items).toContain('🍌 Banana');
      expect(result.items).toContain('🍎 Maçã');
    });
  });

  describe('buildReorderListPrompt', () => {
    it('includes existing items and sections with custom prompt', () => {
      const items = ['🍌 Banana', '🥛 Leite'];
      const sections = ['🥦 Hortifruti', '🥛 Laticínios'];
      const customPrompt = 'Leite fica na frente';

      const prompt = buildReorderListPrompt(items, sections, customPrompt);
      expect(prompt).toContain('🍌 Banana');
      expect(prompt).toContain('🥛 Leite');
      expect(prompt).toContain('🥦 Hortifruti');
      expect(prompt).toContain('Leite fica na frente');
    });
  });

  describe('Cross-Section Drag and Drop Logic', () => {
    it('correctly maps sectionId to items based on preceding section header in flattened order', () => {
      const secHortifruti: Section = { id: 'sec-1', title: 'Hortifruti', order: 0 };
      const secLimpeza: Section = { id: 'sec-2', title: 'Limpeza', order: 1 };

      const item1 = new TuduViewModel({ id: 't1', label: 'Banana', done: false, sectionId: 'sec-1' }, 'l1');
      const item2 = new TuduViewModel({ id: 't2', label: 'Maçã', done: false, sectionId: 'sec-1' }, 'l1');
      const item3 = new TuduViewModel({ id: 't3', label: 'Detergente', done: false, sectionId: 'sec-2' }, 'l1');

      // User drags item3 (Detergente) from Limpeza into Hortifruti (between Banana and Maçã)
      type Row =
        | { type: 'section_header'; section: Section }
        | { type: 'tudu'; tudu: TuduViewModel };

      const reorderedRows: Row[] = [
        { type: 'section_header', section: secHortifruti },
        { type: 'tudu', tudu: item1 },
        { type: 'tudu', tudu: item3 }, // Moved here!
        { type: 'tudu', tudu: item2 },
        { type: 'section_header', section: secLimpeza },
      ];

      // Reconstructed logic
      let currentSectionId: string | undefined = undefined;
      const resultTudus: TuduViewModel[] = [];

      for (const row of reorderedRows) {
        if (row.type === 'section_header') {
          currentSectionId = row.section.id;
        } else if (row.type === 'tudu') {
          const cloned = row.tudu.clone();
          cloned.sectionId = currentSectionId;
          resultTudus.push(cloned);
        }
      }

      expect(resultTudus).toHaveLength(3);
      expect(resultTudus[0].label).toBe('Banana');
      expect(resultTudus[0].sectionId).toBe('sec-1');
      expect(resultTudus[1].label).toBe('Detergente');
      expect(resultTudus[1].sectionId).toBe('sec-1'); // Successfully moved to sec-1!
      expect(resultTudus[2].label).toBe('Maçã');
      expect(resultTudus[2].sectionId).toBe('sec-1');
    });

    it('correctly sets sectionId to undefined for items dragged before first section header', () => {
      const secHortifruti: Section = { id: 'sec-1', title: 'Hortifruti', order: 0 };
      const item1 = new TuduViewModel({ id: 't1', label: 'Item Sem Seção', done: false, sectionId: 'sec-1' }, 'l1');

      type Row =
        | { type: 'section_header'; section: Section }
        | { type: 'tudu'; tudu: TuduViewModel };

      const reorderedRows: Row[] = [
        { type: 'tudu', tudu: item1 }, // Placed above all section headers!
        { type: 'section_header', section: secHortifruti },
      ];

      let currentSectionId: string | undefined = undefined;
      const resultTudus: TuduViewModel[] = [];

      for (const row of reorderedRows) {
        if (row.type === 'section_header') {
          currentSectionId = row.section.id;
        } else if (row.type === 'tudu') {
          const cloned = row.tudu.clone();
          cloned.sectionId = currentSectionId;
          resultTudus.push(cloned);
        }
      }

      expect(resultTudus[0].sectionId).toBeUndefined();
    });

    it('correctly maps sectionId when item is dragged into an empty section (with empty dropzone)', () => {
      const secNova: Section = { id: 'sec-new', title: 'Nova Seção', order: 0 };
      const item1 = new TuduViewModel({ id: 't1', label: 'Item 1', done: false }, 'l1');

      type Row =
        | { type: 'section_header'; section: Section }
        | { type: 'empty_section_dropzone'; section: Section }
        | { type: 'tudu'; tudu: TuduViewModel };

      // User drags item1 below section_header or after dropzone
      const reorderedRows: Row[] = [
        { type: 'section_header', section: secNova },
        { type: 'empty_section_dropzone', section: secNova },
        { type: 'tudu', tudu: item1 },
      ];

      let currentSectionId: string | undefined = undefined;
      const resultTudus: TuduViewModel[] = [];

      for (const row of reorderedRows) {
        if (row.type === 'section_header') {
          currentSectionId = row.section.id;
        } else if (row.type === 'empty_section_dropzone') {
          currentSectionId = row.section.id;
        } else if (row.type === 'tudu') {
          const cloned = row.tudu.clone();
          cloned.sectionId = currentSectionId;
          resultTudus.push(cloned);
        }
      }

      expect(resultTudus).toHaveLength(1);
      expect(resultTudus[0].sectionId).toBe('sec-new');

      // Now verify list state update preserves the section
      const list = new ListViewModel({
        id: 'l1',
        label: 'Minha Lista',
        sections: [secNova],
      });

      const updatedList = cloneList(list);
      updatedList.tudus = resultTudus;

      expect(updatedList.sections).toHaveLength(1);
      expect(updatedList.sections![0].id).toBe('sec-new');
      expect(updatedList.tudus[0].sectionId).toBe('sec-new');
    });
  });

  describe('Reorder Prompt Modal Logic', () => {
    it('pre-selects custom ordering when initialPrompt is provided', () => {
      const initialPrompt = 'Mercado Assaí hortifruti primeiro';
      const selectedType = initialPrompt && initialPrompt.trim().length > 0 ? 'custom' : 'smart';
      expect(selectedType).toBe('custom');
    });

    it('pre-selects smart ordering when no initialPrompt is provided', () => {
      const initialPrompt = '';
      const selectedType = initialPrompt && initialPrompt.trim().length > 0 ? 'custom' : 'smart';
      expect(selectedType).toBe('smart');
    });

    it('correctly maps applied reordered items to existing TuduViewModels and retains unmapped items', () => {
      const t1 = new TuduViewModel({ id: 't1', label: 'Maçã', done: false }, 'l1');
      const t2 = new TuduViewModel({ id: 't2', label: 'Banana', done: true }, 'l1');
      const t3 = new TuduViewModel({ id: 't3', label: 'Detergente', done: false }, 'l1');
      const currentTudus = [t1, t2, t3];

      const reorderedItems = [
        { label: 'Detergente', sectionTitle: 'Limpeza' },
        { label: 'Banana', sectionTitle: 'Hortifruti' },
      ];

      const sectionTitleToId = new Map([
        ['Limpeza', 'sec-limpeza'],
        ['Hortifruti', 'sec-hortifruti'],
      ]);

      const usedTuduIds = new Set<string>();
      const reorderedTudus: TuduViewModel[] = [];

      reorderedItems.forEach(item => {
        const secId = item.sectionTitle ? sectionTitleToId.get(item.sectionTitle) : undefined;
        const match = currentTudus.find(
          t => !usedTuduIds.has(t.id) && t.label.toLowerCase() === item.label.toLowerCase(),
        );
        if (match) {
          usedTuduIds.add(match.id);
          const cloned = match.clone();
          cloned.sectionId = secId;
          reorderedTudus.push(cloned);
        }
      });

      // Retain unmapped items (t1: Maçã)
      currentTudus.forEach(t => {
        if (!usedTuduIds.has(t.id)) {
          reorderedTudus.push(t.clone());
        }
      });

      expect(reorderedTudus).toHaveLength(3);
      expect(reorderedTudus[0].label).toBe('Detergente');
      expect(reorderedTudus[0].sectionId).toBe('sec-limpeza');
      expect(reorderedTudus[1].label).toBe('Banana');
      expect(reorderedTudus[1].done).toBe(true); // Preserves done state
      expect(reorderedTudus[1].sectionId).toBe('sec-hortifruti');
      expect(reorderedTudus[2].label).toBe('Maçã');
      expect(reorderedTudus[2].sectionId).toBeUndefined();
    });
  });

  describe('Section Visibility Logic (Hide on All Done, Show Empty Sections)', () => {
    const getVisibleSections = (
      sections: Section[],
      tudus: TuduViewModel[],
    ): Section[] => {
      const undoneTudus = tudus.filter(t => !t.done);
      const doneTudus = tudus.filter(t => t.done);
      return sections.filter(sec => {
        const hasUndone = undoneTudus.some(t => t.sectionId === sec.id);
        const hasDone = doneTudus.some(t => t.sectionId === sec.id);
        return hasUndone || !hasDone;
      });
    };

    it('shows newly created empty section with no items', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      const tudus: TuduViewModel[] = [];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('sec-1');
    });

    it('shows section with active items', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      const tudus = [
        new TuduViewModel({ id: 't1', label: 'Pão', done: false, sectionId: 'sec-1' }, 'l1'),
      ];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('sec-1');
    });

    it('shows section with mixed active and done items', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      const tudus = [
        new TuduViewModel({ id: 't1', label: 'Pão', done: false, sectionId: 'sec-1' }, 'l1'),
        new TuduViewModel({ id: 't2', label: 'Leite', done: true, sectionId: 'sec-1' }, 'l1'),
      ];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('sec-1');
    });

    it('hides section when the last active item is marked done', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      const tudus = [
        new TuduViewModel({ id: 't1', label: 'Pão', done: true, sectionId: 'sec-1' }, 'l1'),
        new TuduViewModel({ id: 't2', label: 'Leite', done: true, sectionId: 'sec-1' }, 'l1'),
      ];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(0);
    });

    it('shows empty section when all its items were dragged to another section', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sec2: Section = { id: 'sec-2', title: 'Trabalho', order: 1 };
      const sections = [sec1, sec2];
      // Item was previously in sec-1, but dragged to sec-2
      const tudus = [
        new TuduViewModel({ id: 't1', label: 'Pão', done: false, sectionId: 'sec-2' }, 'l1'),
      ];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(2);
      expect(visible.map(s => s.id)).toEqual(['sec-1', 'sec-2']);
    });

    it('shows empty section when all its items were deleted', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      // Item deleted from list
      const tudus: TuduViewModel[] = [];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('sec-1');
    });

    it('unhides section when a done item is unmarked', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sections = [sec1];
      const item1 = new TuduViewModel({ id: 't1', label: 'Pão', done: true, sectionId: 'sec-1' }, 'l1');
      const tudus = [item1];

      // Initially hidden because all items are done
      expect(getVisibleSections(sections, tudus)).toHaveLength(0);

      // User unmarks the item
      item1.done = false;
      const visibleAfterUnmark = getVisibleSections(sections, tudus);
      expect(visibleAfterUnmark).toHaveLength(1);
      expect(visibleAfterUnmark[0].id).toBe('sec-1');
    });

    it('only hides the completed section among multiple sections', () => {
      const sec1: Section = { id: 'sec-1', title: 'Compras', order: 0 };
      const sec2: Section = { id: 'sec-2', title: 'Trabalho', order: 1 };
      const sections = [sec1, sec2];
      const tudus = [
        // sec-1 is completed
        new TuduViewModel({ id: 't1', label: 'Pão', done: true, sectionId: 'sec-1' }, 'l1'),
        // sec-2 has an active item
        new TuduViewModel({ id: 't2', label: 'Relatório', done: false, sectionId: 'sec-2' }, 'l1'),
      ];

      const visible = getVisibleSections(sections, tudus);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('sec-2');
    });
  });

  describe('cloneList and Section Creation Resilience', () => {
    it('clones an instance of ListViewModel successfully', () => {
      const list = new ListViewModel({
        id: 'list-1',
        label: 'Minha Lista',
        sections: [{ id: 'sec-1', title: 'Seção 1', order: 0 }],
      });
      list.tudus = [
        new TuduViewModel({ id: 't1', label: 'Item 1', done: false, sectionId: 'sec-1' }, 'list-1'),
      ];

      const cloned = cloneList(list);
      expect(cloned).toBeInstanceOf(ListViewModel);
      expect(cloned.id).toBe('list-1');
      expect(cloned.sections).toHaveLength(1);
      expect(cloned.tudus).toHaveLength(1);
      expect(typeof cloned.clone).toBe('function');
    });

    it('safely clones a plain object that lost its prototype (e.g. from state spread)', () => {
      // Simulate object that lost its prototype like `{ ...current }`
      const plainObject = {
        id: 'list-1',
        label: 'Minha Lista',
        origin: 'default' as const,
        sections: [{ id: 'sec-1', title: 'Seção 1', order: 0 }],
        tudus: [
          new TuduViewModel({ id: 't1', label: 'Item 1', done: false, sectionId: 'sec-1' }, 'list-1'),
        ],
      } as unknown as ListViewModel;

      // Notice plainObject.clone is undefined
      expect((plainObject as any).clone).toBeUndefined();

      // cloneList should not throw and return a full ListViewModel instance
      const cloned = cloneList(plainObject);
      expect(cloned).toBeInstanceOf(ListViewModel);
      expect(cloned.id).toBe('list-1');
      expect(cloned.sections).toHaveLength(1);
      expect(cloned.tudus).toHaveLength(1);
      expect(typeof cloned.clone).toBe('function');
    });

    it('allows adding a new section to a cloned list without throwing', () => {
      const plainObject = {
        id: 'list-1',
        label: 'Minha Lista',
        origin: 'default' as const,
        sections: [],
        tudus: [],
      } as unknown as ListViewModel;

      const newList = cloneList(plainObject);
      const newSection: Section = {
        id: 'sec-new',
        title: 'Nova Seção',
        order: 0,
      };
      newList.sections = [...(newList.sections || []), newSection];

      expect(newList.sections).toHaveLength(1);
      expect(newList.sections[0].title).toBe('Nova Seção');
      // Verify subsequent clone calls work
      const chainedClone = cloneList(newList);
      expect(chainedClone.sections).toHaveLength(1);
    });
  });
});



