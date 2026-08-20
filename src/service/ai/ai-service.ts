import {AIProvider, EmojiSuggestionRequest} from './types';
import {getSecureApiKey} from './secure-storage';
import {requestOpenAIEmojis} from './adapters/openai';
import {requestGeminiEmojis} from './adapters/gemini';
import {requestClaudeEmojis} from './adapters/claude';

// In-memory cache for emoji suggestions: key -> string[]
const emojiCache = new Map<string, string[]>();
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
