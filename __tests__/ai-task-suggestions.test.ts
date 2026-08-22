jest.mock('react-dom', () => ({}), { virtual: true });
jest.mock('recoil-nexus', () => ({
  setRecoil: jest.fn(),
  getRecoil: jest.fn(),
}));

import {parseTasksFromResponse} from '../src/service/ai/ai-service';
import {requestOpenAITasks} from '../src/service/ai/adapters/openai';
import {requestGeminiTasks} from '../src/service/ai/adapters/gemini';
import {requestClaudeTasks} from '../src/service/ai/adapters/claude';

describe('AI Task Suggestions Feature', () => {
  describe('parseTasksFromResponse', () => {
    it('should parse direct JSON array of task strings', () => {
      const input =
        '["🥖 Comprar pão de forma", "🧀 Comprar queijo prato", "🥛 Leite integral", "☕ Café em pó"]';
      const tasks = parseTasksFromResponse(input);
      expect(tasks).toEqual([
        '🥖 Comprar pão de forma',
        '🧀 Comprar queijo prato',
        '🥛 Leite integral',
        '☕ Café em pó',
      ]);
    });

    it('should parse JSON array inside markdown code fences', () => {
      const input =
        '```json\n[\n  "🧳 Fazer as malas",\n  "🛂 Verificar passaporte",\n  "🏖️ Protetor solar"\n]\n```';
      const tasks = parseTasksFromResponse(input);
      expect(tasks).toEqual([
        '🧳 Fazer as malas',
        '🛂 Verificar passaporte',
        '🏖️ Protetor solar',
      ]);
    });

    it('should fallback to line-by-line parsing when JSON is malformed', () => {
      const input = `
        1. 🍎 Comprar maçãs
        2. 🍌 Comprar bananas
        • 🍇 Comprar uvas
        - 🥑 Comprar abacate
      `;
      const tasks = parseTasksFromResponse(input);
      expect(tasks.length).toBe(4);
      expect(tasks).toContain('🍎 Comprar maçãs');
      expect(tasks).toContain('🍌 Comprar bananas');
      expect(tasks).toContain('🍇 Comprar uvas');
      expect(tasks).toContain('🥑 Comprar abacate');
    });

    it('should return empty array for empty, whitespace, or invalid content', () => {
      expect(parseTasksFromResponse('')).toEqual([]);
      expect(parseTasksFromResponse('   \n  \t ')).toEqual([]);
      expect(parseTasksFromResponse(null as any)).toEqual([]);
    });

    it('should deduplicate and limit items to at most 10', () => {
      const input = JSON.stringify([
        '1️⃣ Item 1',
        '2️⃣ Item 2',
        '3️⃣ Item 3',
        '4️⃣ Item 4',
        '5️⃣ Item 5',
        '6️⃣ Item 6',
        '7️⃣ Item 7',
        '8️⃣ Item 8',
        '9️⃣ Item 9',
        '🔟 Item 10',
        '1️⃣1️⃣ Item 11',
        '1️⃣ Item 1', // duplicate
      ]);
      const tasks = parseTasksFromResponse(input);
      expect(tasks.length).toBeLessThanOrEqual(10);
      expect(new Set(tasks).size).toBe(tasks.length);
    });
  });

  describe('Task Suggestion Adapters', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should handle OpenAI task suggestion response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  '["🛒 Ir ao supermercado", "🍞 Comprar pão francês", "🧀 Comprar queijo"]',
              },
            },
          ],
          usage: {
            prompt_tokens: 50,
            completion_tokens: 20,
            total_tokens: 70,
          },
        }),
      } as any);

      const res = await requestOpenAITasks('mock-key', 'Lista: Mercado');
      const tasks = parseTasksFromResponse(res.content);
      expect(tasks).toEqual([
        '🛒 Ir ao supermercado',
        '🍞 Comprar pão francês',
        '🧀 Comprar queijo',
      ]);
      expect(res.usage).toEqual({
        promptTokens: 50,
        completionTokens: 20,
        totalTokens: 70,
      });
    });

    it('should handle Gemini task suggestion response', async () => {
      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url.includes('/models?key=')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              models: [
                {
                  name: 'models/gemini-2.0-flash',
                  supportedGenerationMethods: ['generateContent'],
                },
              ],
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: '["🏖️ Reservar hotel", "🧳 Fazer as malas", "✈️ Comprar passagens"]',
                    },
                  ],
                },
              },
            ],
            usageMetadata: {
              promptTokenCount: 60,
              candidatesTokenCount: 25,
              totalTokenCount: 85,
            },
          }),
        });
      });

      const res = await requestGeminiTasks('mock-key', 'Lista: Viagem para a praia');
      const tasks = parseTasksFromResponse(res.content);
      expect(tasks).toEqual([
        '🏖️ Reservar hotel',
        '🧳 Fazer as malas',
        '✈️ Comprar passagens',
      ]);
      expect(res.usage).toEqual({
        promptTokens: 60,
        completionTokens: 25,
        totalTokens: 85,
      });
    });

    it('should handle Claude task suggestion response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [
            {
              text: '["🏋️ Treino de peito", "🏃 30 min cardio", "💧 Beber 3L de água"]',
            },
          ],
          usage: {
            input_tokens: 45,
            output_tokens: 22,
          },
        }),
      } as any);

      const res = await requestClaudeTasks('mock-key', 'Lista: Academia e Saúde');
      const tasks = parseTasksFromResponse(res.content);
      expect(tasks).toEqual([
        '🏋️ Treino de peito',
        '🏃 30 min cardio',
        '💧 Beber 3L de água',
      ]);
      expect(res.usage).toEqual({
        promptTokens: 45,
        completionTokens: 22,
        totalTokens: 67,
      });
    });

    it('should throw error when API call fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({
          error: {message: 'Rate limit exceeded'},
        }),
      } as any);

      await expect(
        requestOpenAITasks('mock-key', 'Lista: Teste'),
      ).rejects.toThrow('Rate limit exceeded');
    });
  });
});

