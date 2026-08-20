export const requestOpenAIEmojis = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<string> => {
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
  return data?.choices?.[0]?.message?.content || '';
};
