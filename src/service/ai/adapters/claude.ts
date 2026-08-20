export const requestClaudeEmojis = async (
  apiKey: string,
  prompt: string,
  signal?: AbortSignal,
): Promise<string> => {
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
  return data?.content?.[0]?.text || '';
};
