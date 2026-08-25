import {
  AIFeature,
  AIProvider,
  AIResponseWithUsage,
  AITokenUsage,
  AITokenUsageRecord,
  EmojiSuggestionRequest,
  ParsedListResult,
  TaskSuggestionRequest,
} from './types';
import {getSecureApiKey} from './secure-storage';
import {
  requestOpenAIEmojis,
  requestOpenAIParseList,
  requestOpenAITasks,
} from './adapters/openai';
import {
  requestGeminiEmojis,
  requestGeminiParseList,
  requestGeminiTasks,
} from './adapters/gemini';
import {
  requestClaudeEmojis,
  requestClaudeParseList,
  requestClaudeTasks,
} from './adapters/claude';
import {setRecoil} from 'recoil-nexus';
import {aiTokenUsageState} from '../../state/atoms';

// In-memory cache for emoji suggestions: key -> string[]
const emojiCache = new Map<string, string[]>();
// In-memory cache for task suggestions: key -> string[]
const taskCache = new Map<string, string[]>();
const MAX_CACHE_SIZE = 50;

/**
 * Records token consumption for an AI request in persistent Recoil state.
 */
export const recordAITokenUsage = (
  provider: AIProvider,
  feature: AIFeature,
  usage?: AITokenUsage,
) => {
  if (!usage || usage.totalTokens <= 0) return;

  const newRecord: AITokenUsageRecord = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
    provider,
    feature,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
  };

  try {
    setRecoil(aiTokenUsageState, prev => {
      const records = prev?.records ? [newRecord, ...prev.records] : [newRecord];
      return {
        records: records.slice(0, 1000),
        lastResetAt: prev?.lastResetAt || null,
      };
    });
    console.log(
      `📊 [Tudú AI Usage] Gravado: ${usage.totalTokens} tokens (${usage.promptTokens} in / ${usage.completionTokens} out) | ${provider.toUpperCase()} | ${feature}`,
    );
  } catch (err) {
    console.warn('⚠️ [Tudú AI Usage] Falha ao persistir uso de tokens:', err);
  }
};

/**
 * Extracts emoji characters from raw LLM responses.
 * Tries JSON parsing first, falls back to Unicode regex parsing.
 */
export const parseEmojisFromResponse = (raw: string): string[] => {
  if (!raw || typeof raw !== 'string') return [];

  // Try parsing direct JSON or JSON within markdown codeblocks
  try {
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      const results = parsed
        .map(e => (typeof e === 'string' ? e.trim() : ''))
        .filter(e => e.length > 0 && isEmojiString(e));
      if (results.length > 0) {
        return Array.from(new Set(results)).slice(0, 10);
      }
    }
  } catch {
    // Continue to regex fallback
  }

  // Regex fallback: extract emojis (including compound emojis, modifiers, ZWJ sequences)
  const emojiRegex =
    /(\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic})*)/gu;
  const matches = raw.match(emojiRegex) || [];
  const unique = Array.from(new Set(matches.map(m => m.trim()))).filter(
    m => m.length > 0,
  );
  return unique.slice(0, 10);
};

const isEmojiString = (str: string): boolean => {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return emojiRegex.test(str);
};

const buildPrompt = (request: EmojiSuggestionRequest): string => {
  const cleanTitle = request.title.replace(/\s+/g, ' ').trim();
  const cleanListName = request.listName
    ? request.listName.replace(/\s+/g, ' ').trim()
    : '';

  if (request.type === 'list') {
    return `Nome da lista: "${cleanTitle}"\nSugira entre 5 e 10 emojis relacionados ao tema ou categoria desta lista.`;
  }

  if (cleanListName.length > 0) {
    return `Lista: "${cleanListName}"\nTarefa: "${cleanTitle}"\nSugira entre 5 e 10 emojis específicos e adequados para esta tarefa dentro desta lista.`;
  }

  return `Tarefa: "${cleanTitle}"\nSugira entre 5 e 10 emojis específicos e adequados para esta tarefa.`;
};

const getCacheKey = (
  provider: AIProvider,
  request: EmojiSuggestionRequest,
): string => {
  const listName = request.listName
    ? request.listName.replace(/\s+/g, ' ').trim().toLowerCase()
    : '';
  const title = request.title.replace(/\s+/g, ' ').trim().toLowerCase();
  return `${provider}:${request.type}:${listName}:${title}`;
};

/**
 * Main method to suggest emojis using the configured AI provider.
 */
export const suggestEmojisWithAI = async (
  provider: AIProvider,
  request: EmojiSuggestionRequest,
  timeoutMs: number = 7000,
): Promise<string[]> => {
  const cleanTitle = request.title.replace(/\s+/g, ' ').trim();
  if (!cleanTitle || cleanTitle.length < 2) {
    return [];
  }

  const cacheKey = getCacheKey(provider, request);
  const cached = emojiCache.get(cacheKey);
  if (cached && cached.length > 0) {
    console.log(`⚡ [Tudú AI Cache] Hit para "${cacheKey}": ${cached.join(' ')}`);
    return cached;
  }

  const apiKey = getSecureApiKey(provider);
  if (!apiKey) {
    console.warn(`⚠️ [Tudú AI] Nenhuma chave de API configurada para o provedor: ${provider}`);
    throw new Error('API Key not found');
  }

  const prompt = buildPrompt(request);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🤖 [Tudú AI] 🚀 Enviando prompt para ${provider.toUpperCase()}`);
  console.log(`📌 Tipo: ${request.type} | Título: "${cleanTitle}" | Lista: "${request.listName || 'N/A'}"`);
  console.log(`💬 Prompt:\n${prompt}`);
  console.log('─────────────────────────────────────────────────────');

  try {
    let responseResult: AIResponseWithUsage = {content: ''};
    const startTime = Date.now();

    if (provider === 'openai') {
      responseResult = await requestOpenAIEmojis(apiKey, prompt, controller.signal);
    } else if (provider === 'gemini') {
      responseResult = await requestGeminiEmojis(apiKey, prompt, controller.signal);
    } else if (provider === 'claude') {
      responseResult = await requestClaudeEmojis(apiKey, prompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const rawResponse = responseResult.content;

    if (responseResult.usage) {
      recordAITokenUsage(provider, 'emoji', responseResult.usage);
    }

    const emojis = parseEmojisFromResponse(rawResponse);

    console.log(`📥 [Tudú AI] Resposta recebida (${duration}ms) de ${provider.toUpperCase()}:`);
    console.log(`📄 Bruto: ${rawResponse.trim()}`);
    console.log(`✨ Emojis Extraídos (${emojis.length}): ${emojis.join(' ')}`);
    if (responseResult.usage) {
      console.log(
        `📊 Tokens: ${responseResult.usage.totalTokens} (In: ${responseResult.usage.promptTokens}, Out: ${responseResult.usage.completionTokens})`,
      );
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (emojis.length > 0) {
      if (emojiCache.size >= MAX_CACHE_SIZE) {
        const firstKey = emojiCache.keys().next().value;
        if (firstKey) emojiCache.delete(firstKey);
      }
      emojiCache.set(cacheKey, emojis);
    }

    return emojis;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`❌ [Tudú AI] Erro na requisição (${provider.toUpperCase()}):`, error?.message || error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

/**
 * Parses task items from raw LLM responses.
 * Tries JSON array parsing first, falls back to line-by-line extraction.
 */
export const parseTasksFromResponse = (raw: string): string[] => {
  if (!raw || typeof raw !== 'string') return [];

  // Try JSON parsing
  try {
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      const results = parsed
        .map(t => (typeof t === 'string' ? t.trim() : ''))
        .filter(t => t.length > 0);
      if (results.length > 0) {
        return Array.from(new Set(results)).slice(0, 10);
      }
    }
  } catch {
    // Continue to line-by-line fallback
  }

  // Fallback: Line-by-line extraction (stripping bullet points / numbers)
  const lines = raw
    .split('\n')
    .map(line =>
      line
        .replace(/^[\s*•\-–—\d.)\]}>]+/, '')
        .replace(/^["']|["']$/g, '')
        .trim(),
    )
    .filter(line => line.length > 0 && !line.startsWith('{') && !line.startsWith('}'));

  const unique = Array.from(new Set(lines));
  return unique.slice(0, 10);
};

const buildTaskPrompt = (request: TaskSuggestionRequest): string => {
  const cleanListName = request.listName.replace(/\s+/g, ' ').trim();
  const count = request.count || 6;

  let prompt = `Lista: "${cleanListName}"\n`;

  if (request.currentInput && request.currentInput.trim().length > 0) {
    prompt += `Contexto / Ideia inicial: "${request.currentInput.trim()}"\n`;
  }

  if (request.existingTasks && request.existingTasks.length > 0) {
    const existingList = request.existingTasks
      .slice(0, 15)
      .map(t => `- ${t}`)
      .join('\n');
    prompt += `Tarefas já presentes na lista (NÃO repita e NÃO sugira itens muito parecidos com estes):\n${existingList}\n`;
  }

  prompt += `\nSugira entre 5 e ${count} próximos itens/tarefas práticos, objetivos e altamente relevantes para esta lista.\n`;
  prompt += `Cada item DEVE começar com um emoji adequado, seguido de um espaço e o nome do item no mesmo idioma da lista (ex: "🍞 Comprar pão", "🧳 Fazer as malas").\n`;
  prompt += `Retorne estritamente um array JSON de strings no formato ["emoji texto", "emoji texto"].`;

  return prompt;
};

const getTaskCacheKey = (
  provider: AIProvider,
  request: TaskSuggestionRequest,
): string => {
  const listName = request.listName.replace(/\s+/g, ' ').trim().toLowerCase();
  const input = request.currentInput
    ? request.currentInput.replace(/\s+/g, ' ').trim().toLowerCase()
    : '';
  const existingHash = request.existingTasks
    ? request.existingTasks
        .slice(0, 10)
        .map(t => t.trim().toLowerCase())
        .sort()
        .join('|')
    : '';
  return `${provider}:tasks:${listName}:${input}:${existingHash}`;
};

/**
 * Main method to suggest list items/tasks using the configured AI provider.
 */
export const suggestTasksWithAI = async (
  provider: AIProvider,
  request: TaskSuggestionRequest,
  timeoutMs: number = 8500,
  forceRefresh: boolean = false,
): Promise<string[]> => {
  const cleanListName = request.listName.replace(/\s+/g, ' ').trim();
  if (!cleanListName) {
    return [];
  }

  const cacheKey = getTaskCacheKey(provider, request);
  if (!forceRefresh) {
    const cached = taskCache.get(cacheKey);
    if (cached && cached.length > 0) {
      console.log(`⚡ [Tudú AI Task Cache] Hit para "${cacheKey}": ${cached.join(' | ')}`);
      return cached;
    }
  }

  const apiKey = getSecureApiKey(provider);
  if (!apiKey) {
    console.warn(`⚠️ [Tudú AI] Nenhuma chave de API configurada para o provedor: ${provider}`);
    throw new Error('API Key not found');
  }

  const prompt = buildTaskPrompt(request);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🤖 [Tudú AI] 🚀 Enviando prompt de tarefas para ${provider.toUpperCase()}`);
  console.log(`📌 Lista: "${cleanListName}" | Seed: "${request.currentInput || 'N/A'}"`);
  console.log(`💬 Prompt:\n${prompt}`);
  console.log('─────────────────────────────────────────────────────');

  try {
    let responseResult: AIResponseWithUsage = {content: ''};
    const startTime = Date.now();

    if (provider === 'openai') {
      responseResult = await requestOpenAITasks(apiKey, prompt, controller.signal);
    } else if (provider === 'gemini') {
      responseResult = await requestGeminiTasks(apiKey, prompt, controller.signal);
    } else if (provider === 'claude') {
      responseResult = await requestClaudeTasks(apiKey, prompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const rawResponse = responseResult.content;

    if (responseResult.usage) {
      recordAITokenUsage(provider, 'task_suggestions', responseResult.usage);
    }

    const tasks = parseTasksFromResponse(rawResponse);

    console.log(`📥 [Tudú AI] Resposta de tarefas recebida (${duration}ms) de ${provider.toUpperCase()}:`);
    console.log(`📄 Bruto: ${rawResponse.trim()}`);
    console.log(`✨ Tarefas Extraídas (${tasks.length}):\n${tasks.map(t => `  • ${t}`).join('\n')}`);
    if (responseResult.usage) {
      console.log(
        `📊 Tokens: ${responseResult.usage.totalTokens} (In: ${responseResult.usage.promptTokens}, Out: ${responseResult.usage.completionTokens})`,
      );
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (tasks.length > 0) {
      if (taskCache.size >= MAX_CACHE_SIZE) {
        const firstKey = taskCache.keys().next().value;
        if (firstKey) taskCache.delete(firstKey);
      }
      taskCache.set(cacheKey, tasks);
    }

    return tasks;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`❌ [Tudú AI] Erro na requisição de tarefas (${provider.toUpperCase()}):`, error?.message || error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

/**
 * Tests connection with the given provider and API key.
 */
export const testAIConnection = async (
  provider: AIProvider,
  apiKey: string,
  timeoutMs: number = 8000,
): Promise<boolean> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const testPrompt = 'Item de teste: Supermercado e Frutas';

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🧪 [Tudú AI Test] Testando conexão com ${provider.toUpperCase()}...`);
  console.log(`💬 Prompt de Teste: "${testPrompt}"`);

  try {
    let responseResult: AIResponseWithUsage = {content: ''};
    const startTime = Date.now();

    if (provider === 'openai') {
      responseResult = await requestOpenAIEmojis(apiKey, testPrompt, controller.signal);
    } else if (provider === 'gemini') {
      responseResult = await requestGeminiEmojis(apiKey, testPrompt, controller.signal);
    } else if (provider === 'claude') {
      responseResult = await requestClaudeEmojis(apiKey, testPrompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const rawResponse = responseResult.content;

    if (responseResult.usage) {
      recordAITokenUsage(provider, 'test', responseResult.usage);
    }

    const emojis = parseEmojisFromResponse(rawResponse);

    console.log(`✅ [Tudú AI Test] Conexão com ${provider.toUpperCase()} bem sucedida (${duration}ms)!`);
    console.log(`✨ Emojis retornados: ${emojis.join(' ')}`);
    if (responseResult.usage) {
      console.log(
        `📊 Tokens: ${responseResult.usage.totalTokens} (In: ${responseResult.usage.promptTokens}, Out: ${responseResult.usage.completionTokens})`,
      );
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return emojis.length > 0;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`❌ [Tudú AI Test] Falha no teste (${provider.toUpperCase()}):`, error?.message || error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

/**
 * Parses title and items from raw LLM response.
 * Tries JSON parsing first, then falls back to resilient line-by-line extraction.
 */
export const parseListResultFromResponse = (raw: string): ParsedListResult => {
  const fallbackResult: ParsedListResult = {
    title: '📝 Lista',
    items: [],
  };

  if (!raw || typeof raw !== 'string') {
    return fallbackResult;
  }

  // 1. Try parsing JSON directly or wrapped in markdown code blocks
  try {
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed)) {
        // Model returned just an array of items
        const items = parsed
          .map(t => (typeof t === 'string' ? t.trim() : ''))
          .filter(t => t.length > 0);
        return {
          title: '📝 Lista',
          items: Array.from(new Set(items)),
        };
      }

      const rawTitle = typeof parsed.title === 'string' ? parsed.title.trim() : '';
      const title = rawTitle.length > 0 ? rawTitle : '📝 Lista';

      const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
      const items = rawItems
        .map((t: any) => (typeof t === 'string' ? t.trim() : ''))
        .filter((t: string) => t.length > 0);

      return {
        title,
        items: Array.from(new Set(items)),
      };
    }
  } catch {
    // Continue to fallback parsing
  }

  // 2. Fallback: line-by-line regex extraction
  const lines = raw
    .split('\n')
    .map(line =>
      line
        .replace(/^[\s*•\-–—\d.)\]}>]+/, '')
        .replace(/^["']|["']$/g, '')
        .trim(),
    )
    .filter(
      line =>
        line.length > 0 &&
        !line.startsWith('{') &&
        !line.startsWith('}') &&
        !line.startsWith('[') &&
        !line.startsWith(']') &&
        !line.toLowerCase().startsWith('items:') &&
        !line.toLowerCase().startsWith('title:'),
    );

  const uniqueItems = Array.from(new Set(lines));

  return {
    title: '📝 Lista',
    items: uniqueItems,
  };
};

export const buildParseListPrompt = (rawText: string): string => {
  const clean = rawText.trim();
  return (
    `Texto colado pelo usuário:\n` +
    `"""\n${clean}\n"""\n\n` +
    `Analise o texto acima e organize-o em uma lista de tudús/tarefas estruturada.\n` +
    `Diretrizes:\n` +
    `1. Extraia somente tarefas/itens reais. Ignore carimbos de data/hora, nomes de pessoas, cabeçalhos de mensagens (ex: "[15/08/2026, 14:46:44] Day ❤:") e conversas informais.\n` +
    `2. Se mensagens posteriores complementarem ou retificarem um item anterior (ex: "ovos" e depois "Pega logo 2 bandejas de ovo"), consolide na intenção final ("2 bandejas de ovos").\n` +
    `3. Mantenha quantidades, unidades e observações (ex: "8 pão francês", "2 leite condensado moça", "pera (se tiver macia)").\n` +
    `4. Adicione um emoji relevante e claro no início de CADA item da lista (ex: "🥚 2 bandejas de ovos", "🍞 Pão de forma", "🍌 Banana", "🍅 4 tomates").\n` +
    `5. Gere um título conciso para a lista com um emoji adequado no mesmo idioma do texto (ex: "🛒 Compras de Mercado", "📝 Lista de Tarefas", "💊 Farmácia").\n` +
    `6. Se o texto NÃO contiver tarefas ou itens acionáveis, retorne "items": [].\n` +
    `7. Retorne estritamente um JSON no formato: {"title": "Título com emoji", "items": ["emoji item 1", "emoji item 2"]}. Não inclua blocos de markdown nem explicações adicionais.`
  );
};

/**
 * Main method to parse a raw text into a structured list with items using AI.
 */
export const parseListFromTextWithAI = async (
  provider: AIProvider,
  rawText: string,
  timeoutMs: number = 10000,
): Promise<ParsedListResult> => {
  const cleanText = rawText.trim();
  if (!cleanText || cleanText.length < 2) {
    return { title: '📝 Lista', items: [] };
  }

  const apiKey = getSecureApiKey(provider);
  if (!apiKey) {
    console.warn(`⚠️ [Tudú AI] Nenhuma chave de API configurada para o provedor: ${provider}`);
    throw new Error('API Key not found');
  }

  const prompt = buildParseListPrompt(cleanText);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🤖 [Tudú AI] 🚀 Enviando texto para conversão em lista com ${provider.toUpperCase()}`);
  console.log(`📌 Tamanho do texto: ${cleanText.length} caracteres`);
  console.log(`💬 Prompt:\n${prompt}`);
  console.log('─────────────────────────────────────────────────────');

  try {
    let responseResult: AIResponseWithUsage = { content: '' };
    const startTime = Date.now();

    if (provider === 'openai') {
      responseResult = await requestOpenAIParseList(apiKey, prompt, controller.signal);
    } else if (provider === 'gemini') {
      responseResult = await requestGeminiParseList(apiKey, prompt, controller.signal);
    } else if (provider === 'claude') {
      responseResult = await requestClaudeParseList(apiKey, prompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const rawResponse = responseResult.content;

    if (responseResult.usage) {
      recordAITokenUsage(provider, 'parse_list', responseResult.usage);
    }

    const result = parseListResultFromResponse(rawResponse);

    console.log(`📥 [Tudú AI] Resposta de conversão recebida (${duration}ms) de ${provider.toUpperCase()}:`);
    console.log(`🏷️ Título: "${result.title}"`);
    console.log(`✨ Itens Extraídos (${result.items.length}):\n${result.items.map(t => `  • ${t}`).join('\n')}`);
    if (responseResult.usage) {
      console.log(
        `📊 Tokens: ${responseResult.usage.totalTokens} (In: ${responseResult.usage.promptTokens}, Out: ${responseResult.usage.completionTokens})`,
      );
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`❌ [Tudú AI] Erro na conversão de texto (${provider.toUpperCase()}):`, error?.message || error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};



