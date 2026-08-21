import {AIProvider, EmojiSuggestionRequest, TaskSuggestionRequest} from './types';
import {getSecureApiKey} from './secure-storage';
import {requestOpenAIEmojis, requestOpenAITasks} from './adapters/openai';
import {requestGeminiEmojis, requestGeminiTasks} from './adapters/gemini';
import {requestClaudeEmojis, requestClaudeTasks} from './adapters/claude';

// In-memory cache for emoji suggestions: key -> string[]
const emojiCache = new Map<string, string[]>();
// In-memory cache for task suggestions: key -> string[]
const taskCache = new Map<string, string[]>();
const MAX_CACHE_SIZE = 50;


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
    let rawResponse = '';
    const startTime = Date.now();

    if (provider === 'openai') {
      rawResponse = await requestOpenAIEmojis(apiKey, prompt, controller.signal);
    } else if (provider === 'gemini') {
      rawResponse = await requestGeminiEmojis(apiKey, prompt, controller.signal);
    } else if (provider === 'claude') {
      rawResponse = await requestClaudeEmojis(apiKey, prompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    const emojis = parseEmojisFromResponse(rawResponse);

    console.log(`📥 [Tudú AI] Resposta recebida (${duration}ms) de ${provider.toUpperCase()}:`);
    console.log(`📄 Bruto: ${rawResponse.trim()}`);
    console.log(`✨ Emojis Extraídos (${emojis.length}): ${emojis.join(' ')}`);
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
    let rawResponse = '';
    const startTime = Date.now();

    if (provider === 'openai') {
      rawResponse = await requestOpenAITasks(apiKey, prompt, controller.signal);
    } else if (provider === 'gemini') {
      rawResponse = await requestGeminiTasks(apiKey, prompt, controller.signal);
    } else if (provider === 'claude') {
      rawResponse = await requestClaudeTasks(apiKey, prompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    const tasks = parseTasksFromResponse(rawResponse);

    console.log(`📥 [Tudú AI] Resposta de tarefas recebida (${duration}ms) de ${provider.toUpperCase()}:`);
    console.log(`📄 Bruto: ${rawResponse.trim()}`);
    console.log(`✨ Tarefas Extraídas (${tasks.length}):\n${tasks.map(t => `  • ${t}`).join('\n')}`);
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
    let rawResponse = '';
    const startTime = Date.now();

    if (provider === 'openai') {
      rawResponse = await requestOpenAIEmojis(apiKey, testPrompt, controller.signal);
    } else if (provider === 'gemini') {
      rawResponse = await requestGeminiEmojis(apiKey, testPrompt, controller.signal);
    } else if (provider === 'claude') {
      rawResponse = await requestClaudeEmojis(apiKey, testPrompt, controller.signal);
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const emojis = parseEmojisFromResponse(rawResponse);

    console.log(`✅ [Tudú AI Test] Conexão com ${provider.toUpperCase()} bem sucedida (${duration}ms)!`);
    console.log(`✨ Emojis retornados: ${emojis.join(' ')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return emojis.length > 0;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`❌ [Tudú AI Test] Falha no teste (${provider.toUpperCase()}):`, error?.message || error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
};

