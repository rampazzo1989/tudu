import {AIResponseWithUsage} from '../types';

export const requestClaudeEmojis = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 100,
      system:
        'You are an assistant that suggests relevant emojis for tasks and lists in a todo app. Return ONLY a JSON array of 5 to 10 emoji characters, like ["🛒", "🍎", "🥛"]. Do not include markdown formatting or any text other than the JSON array.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Claude API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.input_tokens) || 0,
        completionTokens: Number(data.usage.output_tokens) || 0,
        totalTokens:
          (Number(data.usage.input_tokens) || 0) +
          (Number(data.usage.output_tokens) || 0),
      }
    : undefined;

  return {content, usage};
};

export const requestClaudeTasks = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 350,
      system:
        'You are an assistant for a todo list app. Suggest concise, highly relevant next tasks for the user list. Every item MUST start with an appropriate emoji character followed by a space and the task title in the language of the prompt (e.g. ["🥖 Comprar pão de forma", "🧀 Queijo prato"]). Return ONLY a JSON array of strings. Do not include markdown formatting or any text other than the JSON array.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Claude API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.input_tokens) || 0,
        completionTokens: Number(data.usage.output_tokens) || 0,
        totalTokens:
          (Number(data.usage.input_tokens) || 0) +
          (Number(data.usage.output_tokens) || 0),
      }
    : undefined;

  return {content, usage};
};

export const requestClaudeParseList = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<AIResponseWithUsage> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1500,
      system:
        'You are an intelligent organization assistant in a todo app (Tudú). Your job is to extract, organize, categorize into sections, and reorder todo list items.\n' +
        'Rules:\n' +
        '1. Extract only real, actionable tasks/items and preserve quantities, units, and conditions.\n' +
        '2. Filter out chat metadata (timestamps, dates, sender names, greetings, conversational filler).\n' +
        '3. Understand the list topic / domain (e.g. Movies, Groceries, Books, Travel) and interpret all items strictly within that domain (e.g. in a movie list, "Mãe!" is the movie "Mother!" and must be categorized by movie genre, NEVER as a literal family concept).\n' +
        '4. Every item in the list MUST start with an appropriate emoji (e.g. "🥚 2 bandejas de ovos", "🍞 Pão de forma", "🍌 Banana", "🍿 Mãe!").\n' +
        '5. When categorizing or reordering, ALWAYS group items into well-defined thematic sections (e.g. "🥦 Hortifruti", "🧼 Limpeza e Casa", "🍿 Suspense e Terror", "🎬 Ação e Aventura") with descriptive titles and emojis.\n' +
        '6. Strictly follow all grouping, custom prompt, and smart ordering guidelines provided in the user prompt.\n' +
        '7. Return STRICTLY a valid JSON object matching this schema:\n' +
        '{\n' +
        '  "title": "String title with emoji (e.g. 🛒 Compras de Mercado)",\n' +
        '  "sections": [\n' +
        '    {\n' +
        '      "title": "Emoji + Section Name (e.g. 🥦 Hortifruti)",\n' +
        '      "items": ["emoji item 1", "emoji item 2"]\n' +
        '    }\n' +
        '  ],\n' +
        '  "items": ["emoji item 1", "emoji item 2"]\n' +
        '}\n' +
        'Do not include markdown codeblocks, explanations, or any text outside the JSON object.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Claude API Error (${response.status})`,
    );
  }

  const data = await response.json();
  const content = data?.content?.[0]?.text || '';
  const usage = data?.usage
    ? {
        promptTokens: Number(data.usage.input_tokens) || 0,
        completionTokens: Number(data.usage.output_tokens) || 0,
        totalTokens:
          (Number(data.usage.input_tokens) || 0) +
          (Number(data.usage.output_tokens) || 0),
      }
    : undefined;

  return {content, usage};
};



