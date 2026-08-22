jest.mock('react-dom', () => ({}), { virtual: true });
jest.mock('recoil-nexus', () => ({
  setRecoil: jest.fn(),
  getRecoil: jest.fn(),
}));

import {parseEmojisFromResponse} from '../src/service/ai/ai-service';
import {maskApiKey} from '../src/service/ai/secure-storage';

describe('AI Service & Utilities', () => {
  describe('maskApiKey', () => {
    it('should mask a typical API key correctly', () => {
      const masked = maskApiKey('sk-proj-1234567890abcdef');
      expect(masked.startsWith('sk-p')).toBe(true);
      expect(masked.endsWith('cdef')).toBe(true);
      expect(masked).toContain('••••');
    });

    it('should return placeholder for short or empty keys', () => {
      expect(maskApiKey('')).toBe('••••••••');
      expect(maskApiKey('123')).toBe('••••••••');
    });
  });

  describe('parseEmojisFromResponse', () => {
    it('should parse direct JSON array of emojis', () => {
      const input = '["🛒", "🍎", "🥛", "🍞", "🧀"]';
      const emojis = parseEmojisFromResponse(input);
      expect(emojis).toEqual(['🛒', '🍎', '🥛', '🍞', '🧀']);
    });

    it('should parse JSON inside markdown code blocks', () => {
      const input = '```json\n["🏖️", "✈️", "🌴", "🧳", "☀️"]\n```';
      const emojis = parseEmojisFromResponse(input);
      expect(emojis).toEqual(['🏖️', '✈️', '🌴', '🧳', '☀️']);
    });

    it('should extract emojis via unicode regex fallback when JSON is malformed', () => {
      const input = 'Aqui estão os emojis sugeridos: 🎯 🚀 ⭐ 💡 🔥';
      const emojis = parseEmojisFromResponse(input);
      expect(emojis.length).toBeGreaterThanOrEqual(5);
      expect(emojis).toContain('🎯');
      expect(emojis).toContain('🚀');
      expect(emojis).toContain('⭐');
    });

    it('should return empty array for empty or whitespace string', () => {
      expect(parseEmojisFromResponse('')).toEqual([]);
      expect(parseEmojisFromResponse('   ')).toEqual([]);
    });

    it('should limit result to at most 10 unique emojis', () => {
      const input =
        '["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔥", "🚀"]';
      const emojis = parseEmojisFromResponse(input);
      expect(emojis.length).toBeLessThanOrEqual(10);
    });
  });

  describe('suggestEmojisWithAI and Adapters', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should handle OpenAI successful response', async () => {
      const {requestOpenAIEmojis} = require('../src/service/ai/adapters/openai');
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{message: {content: '["🛒", "🥖", "🧀"]'}}],
          usage: {
            prompt_tokens: 25,
            completion_tokens: 10,
            total_tokens: 35,
          },
        }),
      } as any);

      const res = await requestOpenAIEmojis('mock-key', 'compras');
      const emojis = parseEmojisFromResponse(res.content);
      expect(emojis).toEqual(['🛒', '🥖', '🧀']);
      expect(res.usage).toEqual({
        promptTokens: 25,
        completionTokens: 10,
        totalTokens: 35,
      });
    });

    it('should handle Gemini successful response with dynamic model resolution', async () => {
      const {requestGeminiEmojis} = require('../src/service/ai/adapters/gemini');
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
                  parts: [{text: '["✈️", "🌴", "🏖️"]'}],
                },
              },
            ],
            usageMetadata: {
              promptTokenCount: 30,
              candidatesTokenCount: 8,
              totalTokenCount: 38,
            },
          }),
        });
      });

      const res = await requestGeminiEmojis('mock-key', 'viagem praia');
      const emojis = parseEmojisFromResponse(res.content);
      expect(emojis).toEqual(['✈️', '🌴', '🏖️']);
      expect(res.usage).toEqual({
        promptTokens: 30,
        completionTokens: 8,
        totalTokens: 38,
      });
    });

    it('should handle Claude successful response', async () => {
      const {requestClaudeEmojis} = require('../src/service/ai/adapters/claude');
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{text: '["🏋️", "💪", "🏃"]'}],
          usage: {
            input_tokens: 40,
            output_tokens: 12,
          },
        }),
      } as any);

      const res = await requestClaudeEmojis('mock-key', 'academia treino');
      const emojis = parseEmojisFromResponse(res.content);
      expect(emojis).toEqual(['🏋️', '💪', '🏃']);
      expect(res.usage).toEqual({
        promptTokens: 40,
        completionTokens: 12,
        totalTokens: 52,
      });
    });

    it('should throw descriptive error when API returns HTTP error', async () => {
      const {requestOpenAIEmojis} = require('../src/service/ai/adapters/openai');
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          error: {message: 'Incorrect API key provided'},
        }),
      } as any);

      await expect(
        requestOpenAIEmojis('invalid-key', 'test'),
      ).rejects.toThrow('Incorrect API key provided');
    });
  });
});

