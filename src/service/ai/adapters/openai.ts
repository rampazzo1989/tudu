import {AIResponseWithUsage} from '../types';

export const requestOpenAIEmojis = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that suggests relevant emojis for tasks and lists in a todo app. Return ONLY a valid JSON array of 5 to 10 emoji characters, like ["🛒", "🍎", "🥛"]. Do not include markdown codeblocks, explanations or other text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `OpenAI API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.prompt_tokens) || 0,
        completionTokens: Number(data.usage.completion_tokens) || 0,
        totalTokens: Number(data.usage.total_tokens) || 0,
      }
    : undefined;

  return {content, usage};
};

export const requestOpenAITasks = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant for a todo list app. Suggest concise, highly relevant next tasks for the user list. Every item MUST start with an appropriate emoji character followed by a space and the task title in the language of the prompt (e.g. ["🥖 Comprar pão de forma", "🧀 Queijo prato"]). Return ONLY a valid JSON array of strings. Do not include markdown codeblocks or explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 350,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `OpenAI API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.prompt_tokens) || 0,
        completionTokens: Number(data.usage.completion_tokens) || 0,
        totalTokens: Number(data.usage.total_tokens) || 0,
      }
    : undefined;

  return {content, usage};
};

export const requestOpenAIParseList = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an intelligent assistant in a todo app (Tudú). Your job is to convert raw pasted text (e.g. WhatsApp messages, notes, ingredients, or unstructured lists) into a clean, structured todo list with a list title and individual item tasks.\n' +
            'Rules:\n' +
            '1. Extract only real, actionable tasks/items.\n' +
            '2. Filter out chat metadata (timestamps like [15/08/2026, 14:46:44], dates, sender names like Day ❤:, greetings, conversational filler).\n' +
            '3. If later lines update/clarify an earlier item in a conversation (e.g. "ovos" followed by "Pega logo 2 bandejas de ovo"), combine or select the final consolidated intent ("2 bandejas de ovos").\n' +
            '4. Preserve quantities, units, and conditions (e.g. "8 pão francês", "2 leite condensado moça", "pera (se tiver macia)").\n' +
            '5. Every item in the list MUST start with an appropriate emoji if clear (e.g. "🥚 2 bandejas de ovos", "🍞 Pão de forma", "🍌 Banana", "🍅 4 tomates").\n' +
            '6. Provide an appropriate, concise list title with a relevant emoji in the same language as the prompt (e.g. "🛒 Compras", "📝 Tarefas", "💊 Farmácia").\n' +
            '7. If the text does NOT contain any items/tasks, return an empty array for items.\n' +
            '8. Return STRICTLY a JSON object with keys "title" (string) and "items" (array of strings). Do not include markdown codeblocks or extra text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `OpenAI API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.prompt_tokens) || 0,
        completionTokens: Number(data.usage.completion_tokens) || 0,
        totalTokens: Number(data.usage.total_tokens) || 0,
      }
    : undefined;

  return {content, usage};
};



