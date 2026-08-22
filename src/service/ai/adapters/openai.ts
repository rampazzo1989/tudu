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


