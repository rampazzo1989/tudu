jest.mock('react-dom', () => ({}), { virtual: true });
jest.mock('recoil-nexus', () => ({
  setRecoil: jest.fn(),
  getRecoil: jest.fn(),
}));

import {
  parseListResultFromResponse,
  buildParseListPrompt,
  recordAITokenUsage,
} from '../src/service/ai/ai-service';
import { setRecoil } from 'recoil-nexus';

describe('AI Parse List Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseListResultFromResponse', () => {
    it('should parse direct JSON object with title and items with emojis', () => {
      const input = JSON.stringify({
        title: '🛒 Compras de Mercado',
        items: [
          '🥚 2 bandejas de ovos',
          '🍞 Pão de forma',
          '🥖 8 pão francês',
          '🍌 Banana',
          '🍎 Maçã',
          '🍈 Mamão',
          '🍐 Pera (se tiver macia)',
          '🥔 Batata palha',
          '🥫 2 leite condensado moça',
          '🥬 1 alface',
          '🍅 4 tomates',
        ],
      });

      const result = parseListResultFromResponse(input);
      expect(result.title).toBe('🛒 Compras de Mercado');
      expect(result.items.length).toBe(11);
      expect(result.items[0]).toBe('🥚 2 bandejas de ovos');
      expect(result.items[1]).toBe('🍞 Pão de forma');
      expect(result.items[10]).toBe('🍅 4 tomates');
    });

    it('should parse JSON wrapped in markdown code blocks', () => {
      const input =
        '```json\n{\n  "title": "🏖️ Viagem para a Praia",\n  "items": ["🩳 Protetor solar", "🩱 Roupa de banho", "🕶️ Óculos de sol"]\n}\n```';

      const result = parseListResultFromResponse(input);
      expect(result.title).toBe('🏖️ Viagem para a Praia');
      expect(result.items).toEqual([
        '🩳 Protetor solar',
        '🩱 Roupa de banho',
        '🕶️ Óculos de sol',
      ]);
    });

    it('should handle LLM returning a direct JSON array of items', () => {
      const input = '["🥚 Ovos", "🥛 Leite", "🍞 Pão"]';

      const result = parseListResultFromResponse(input);
      expect(result.title).toBe('📝 Lista');
      expect(result.items).toEqual(['🥚 Ovos', '🥛 Leite', '🍞 Pão']);
    });

    it('should extract line-by-line tasks when LLM returns non-JSON raw text', () => {
      const input = `
        • 🥚 Ovos
        • 🍞 Pão de forma
        • 🍌 Banana
      `;

      const result = parseListResultFromResponse(input);
      expect(result.items.length).toBe(3);
      expect(result.items).toContain('🥚 Ovos');
      expect(result.items).toContain('🍞 Pão de forma');
      expect(result.items).toContain('🍌 Banana');
    });

    it('should return empty items when input is empty or invalid', () => {
      expect(parseListResultFromResponse('')).toEqual({
        title: '📝 Lista',
        items: [],
      });
      expect(parseListResultFromResponse('   ')).toEqual({
        title: '📝 Lista',
        items: [],
      });
    });

    it('should eliminate duplicate items', () => {
      const input = JSON.stringify({
        title: '📝 Lista',
        items: ['🥚 Ovos', '🥚 Ovos', '🥛 Leite'],
      });

      const result = parseListResultFromResponse(input);
      expect(result.items).toEqual(['🥚 Ovos', '🥛 Leite']);
    });
  });

  describe('buildParseListPrompt', () => {
    it('should build prompt containing guidelines for chat filtering and emojis', () => {
      const rawText = `[15/08/2026, 14:46:44] Day ❤:  ovos \n•  pão de forma`;
      const prompt = buildParseListPrompt(rawText);

      expect(prompt).toContain(rawText.trim());
      expect(prompt).toContain('tudús/tarefas');
      expect(prompt).toContain('emoji');
      expect(prompt).toContain('JSON');
    });
  });

  describe('recordAITokenUsage with parse_list feature', () => {
    it('should record token usage for parse_list feature correctly', () => {
      recordAITokenUsage('gemini', 'parse_list', {
        promptTokens: 250,
        completionTokens: 80,
        totalTokens: 330,
      });

      expect(setRecoil).toHaveBeenCalled();
    });
  });
});
