import {AIResponseWithUsage} from '../types';

interface GeminiResolvedConfig {
  apiVersion: 'v1beta' | 'v1';
  model: string;
}

let cachedGeminiConfig: GeminiResolvedConfig | null = null;

const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-pro',
];

const API_VERSIONS: ('v1beta' | 'v1')[] = ['v1beta', 'v1'];

/**
 * Queries Google API to discover models enabled for this API key.
 */
export const discoverGeminiModels = async (
  apiKey: string,
  signal?: AbortSignal,
): Promise<GeminiResolvedConfig[]> => {
  const cleanKey = apiKey.trim();
  const discovered: GeminiResolvedConfig[] = [];

  for (const apiVersion of API_VERSIONS) {
    try {
      const listUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${encodeURIComponent(cleanKey)}`;
      const response = await fetch(listUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey,
        },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        const models = data?.models as Array<{
          name: string;
          supportedGenerationMethods?: string[];
        }>;

        if (Array.isArray(models) && models.length > 0) {
          const supported = models.filter(m =>
            m.supportedGenerationMethods?.includes('generateContent'),
          );

          for (const m of supported) {
            const cleanModelName = m.name.replace(/^models\//, '');
            discovered.push({apiVersion, model: cleanModelName});
          }
        }
      }
    } catch {
      // Continue to next version
    }
  }

  // Sort discovered: prioritize flash models, then pro, then others
  return discovered.sort((a, b) => {
    const aIsFlash = a.model.includes('flash') ? 0 : 1;
    const bIsFlash = b.model.includes('flash') ? 0 : 1;
    return aIsFlash - bIsFlash;
  });
};

export const requestGeminiEmojis = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const emojiSystemInstruction =
    'You are an assistant that suggests relevant emojis for tasks and lists in a todo app. Return ONLY a raw JSON array containing 5 to 10 emoji characters, like ["🛒", "🍎", "🥛"]. No markdown code formatting, no backticks, no explanations.';
  return sendGeminiWithAutoConfig(
    apiKey,
    prompt,
    emojiSystemInstruction,
    100,
    signal,
  );
};

export const requestGeminiTasks = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const tasksSystemInstruction =
    'You are an assistant for a todo list app. Suggest concise, highly relevant next tasks for the user list. Every item MUST start with an appropriate emoji character followed by a space and the task title in the language of the prompt (e.g. ["🥖 Comprar pão de forma", "🧀 Queijo prato"]). Return ONLY a raw JSON array of strings. Do not include markdown code formatting, no backticks, no explanations.';
  return sendGeminiWithAutoConfig(
    apiKey,
    prompt,
    tasksSystemInstruction,
    350,
    signal,
  );
};

export const requestGeminiParseList = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const parseListSystemInstruction =
    'You are an intelligent assistant in a todo app (Tudú). Your job is to convert raw pasted text (e.g. WhatsApp messages, notes, ingredients, or unstructured lists) into a clean, structured todo list with a list title and individual item tasks.\n' +
    'Rules:\n' +
    '1. Extract only real, actionable tasks/items.\n' +
    '2. Filter out chat metadata (timestamps like [15/08/2026, 14:46:44], dates, sender names like Day ❤:, greetings, conversational filler).\n' +
    '3. If later lines update/clarify an earlier item in a conversation (e.g. "ovos" followed by "Pega logo 2 bandejas de ovo"), combine or select the final consolidated intent ("2 bandejas de ovos").\n' +
    '4. Preserve quantities, units, and conditions (e.g. "8 pão francês", "2 leite condensado moça", "pera (se tiver macia)").\n' +
    '5. Every item in the list MUST start with an appropriate emoji if clear (e.g. "🥚 2 bandejas de ovos", "🍞 Pão de forma", "🍌 Banana", "🍅 4 tomates").\n' +
    '6. Provide an appropriate, concise list title with a relevant emoji in the same language as the prompt (e.g. "🛒 Compras", "📝 Tarefas", "💊 Farmácia").\n' +
    '7. If the text does NOT contain any items/tasks, return an empty array for items.\n' +
    '8. Return STRICTLY a raw JSON object with keys "title" (string) and "items" (array of strings). Do not include markdown code formatting, backticks, or extra text.';
  return sendGeminiWithAutoConfig(
    apiKey,
    prompt,
    parseListSystemInstruction,
    600,
    signal,
  );
};


const sendGeminiWithAutoConfig = async (
  apiKey: string,
  prompt: string,
  systemInstruction: string,
  maxOutputTokens: number,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const cleanKey = apiKey.trim();

  // 1. If we have a cached working configuration, try it first
  if (cachedGeminiConfig) {
    try {
      return await executeGeminiRequest(
        cleanKey,
        cachedGeminiConfig.apiVersion,
        cachedGeminiConfig.model,
        prompt,
        systemInstruction,
        maxOutputTokens,
        signal,
      );
    } catch (err: any) {
      // If model not found or invalid, invalidate cache and proceed to full resolution
      cachedGeminiConfig = null;
    }
  }

  // 2. Discover models dynamically from the user's API key
  const discoveredConfigs = await discoverGeminiModels(cleanKey, signal);

  // 3. Prepare full list of configurations to try
  const configsToTry: GeminiResolvedConfig[] = [...discoveredConfigs];

  // Add fallback candidates across API versions if not already in list
  for (const apiVersion of API_VERSIONS) {
    for (const model of CANDIDATE_MODELS) {
      if (
        !configsToTry.some(
          c => c.apiVersion === apiVersion && c.model === model,
        )
      ) {
        configsToTry.push({apiVersion, model});
      }
    }
  }

  let lastError: Error | null = null;

  for (const config of configsToTry) {
    try {
      console.log(`✨ [Gemini Adapter] Testando endpoint: ${config.apiVersion}/models/${config.model}...`);
      const result = await executeGeminiRequest(
        cleanKey,
        config.apiVersion,
        config.model,
        prompt,
        systemInstruction,
        maxOutputTokens,
        signal,
      );

      // Successfully generated content! Cache working config
      console.log(`✅ [Gemini Adapter] Sucesso com modelo: "${config.model}" (${config.apiVersion})`);
      cachedGeminiConfig = config;
      return result;
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      lastError = err;

      const isNotFound =
        err.status === 404 ||
        (err.message &&
          (err.message.includes('404') ||
            err.message.includes('not found') ||
            err.message.includes('not supported')));

      // If model not found or not supported on this version, try next candidate silently
      if (isNotFound) {
        continue;
      }

      // If error is authentication/quota (400, 401, 403, 429), throw immediately
      if (
        err.status === 400 ||
        err.status === 401 ||
        err.status === 403 ||
        err.status === 429 ||
        (err.message &&
          (err.message.includes('API_KEY_INVALID') ||
            err.message.includes('quota') ||
            err.message.includes('RESOURCE_EXHAUSTED')))
      ) {
        throw err;
      }
    }
  }

  throw (
    lastError ||
    new Error('Nenhum modelo compatível encontrado no Gemini para esta chave.')
  );
};

const executeGeminiRequest = async (
  apiKey: string,
  apiVersion: 'v1beta' | 'v1',
  model: string,
  prompt: string,
  systemInstruction: string,
  maxOutputTokens: number,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${systemInstruction}\n\nContext:\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens,
      },
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.error?.message ||
      `Google Gemini API Error (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const usage = data?.usageMetadata
    ? {
        promptTokens: Number(data.usageMetadata.promptTokenCount) || 0,
        completionTokens: Number(data.usageMetadata.candidatesTokenCount) || 0,
        totalTokens:
          Number(data.usageMetadata.totalTokenCount) ||
          (Number(data.usageMetadata.promptTokenCount) || 0) +
            (Number(data.usageMetadata.candidatesTokenCount) || 0),
      }
    : undefined;

  return {content, usage};
};


