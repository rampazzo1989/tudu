import { hasEmoji, stripEmojis, trimEmoji } from '../src/utils/emoji-utils';

describe('Emoji Utils', () => {
  describe('hasEmoji', () => {
    it('should return false for empty, null, undefined or whitespace text', () => {
      expect(hasEmoji('')).toBe(false);
      expect(hasEmoji('   ')).toBe(false);
      expect(hasEmoji(null)).toBe(false);
      expect(hasEmoji(undefined)).toBe(false);
    });

    it('should return false for plain text and numbers without emojis', () => {
      expect(hasEmoji('Comprar pão')).toBe(false);
      expect(hasEmoji('12345')).toBe(false);
      expect(hasEmoji('1. Comprar 2 caixas de leite às 14:30! #urgente $50')).toBe(false);
      expect(hasEmoji('tarefa -t @14:00')).toBe(false);
    });

    it('should return true when emoji is at the start', () => {
      expect(hasEmoji('🥖 Comprar pão')).toBe(true);
      expect(hasEmoji('☕ Tomar café')).toBe(true);
    });

    it('should return true when emoji is at the end or in the middle', () => {
      expect(hasEmoji('Comprar pão 🥖')).toBe(true);
      expect(hasEmoji('Comprar 🍎 maçã e 🍌 banana')).toBe(true);
    });

    it('should return true for complex composite and keycap emojis', () => {
      expect(hasEmoji('👨‍👩‍👧‍👦 Família reunida')).toBe(true);
      expect(hasEmoji('1️⃣ Primeiro item')).toBe(true);
      expect(hasEmoji('#️⃣ Hash')).toBe(true);
      expect(hasEmoji('🇧🇷 Viagem')).toBe(true);
    });
  });

  describe('stripEmojis', () => {
    it('should return empty string for null, undefined or empty input', () => {
      expect(stripEmojis('')).toBe('');
      expect(stripEmojis(null)).toBe('');
      expect(stripEmojis(undefined)).toBe('');
    });

    it('should strip emojis from the beginning of string', () => {
      expect(stripEmojis('🛒 Compras de Mercado')).toBe('Compras de Mercado');
      expect(stripEmojis('🥦 Comprar brócolis')).toBe('Comprar brócolis');
    });

    it('should strip emojis from the middle and end of string', () => {
      expect(stripEmojis('Comprar 🍎 maçã e 🍌 banana')).toBe('Comprar maçã e banana');
      expect(stripEmojis('Reunião de negócios 💼')).toBe('Reunião de negócios');
    });

    it('should strip multiple and consecutive emojis', () => {
      expect(stripEmojis('🛒🥩🍗 Compras semanais 🎉✨')).toBe('Compras semanais');
    });

    it('should strip complex composite emojis (ZWJ sequences, skin tones, flags)', () => {
      expect(stripEmojis('👨‍👩‍👧‍👦 Família reunida')).toBe('Família reunida');
      expect(stripEmojis('👍🏽 Joinha')).toBe('Joinha');
      expect(stripEmojis('🇧🇷 Viagem ao Brasil')).toBe('Viagem ao Brasil');
      expect(stripEmojis('❤️ Coração')).toBe('Coração');
      expect(stripEmojis('🏷️ Etiqueta')).toBe('Etiqueta');
    });

    it('should NOT strip numbers, punctuation or standard text', () => {
      expect(stripEmojis('1. Comprar 2 caixas de leite às 14:30! #urgente $50')).toBe(
        '1. Comprar 2 caixas de leite às 14:30! #urgente $50',
      );
      expect(stripEmojis('100% focado!')).toBe('100% focado!');
    });

    it('should handle strings that are only emojis', () => {
      expect(stripEmojis('🛒')).toBe('');
      expect(stripEmojis('🛒🥦🍎')).toBe('');
    });
  });

  describe('trimEmoji', () => {
    it('should trim emoji from start', () => {
      const result = trimEmoji('🛒 Compras');
      expect(result).toEqual({ emoji: '🛒', formattedText: ' Compras' });
    });

    it('should trim emoji from end', () => {
      const result = trimEmoji('Compras 🛒');
      expect(result).toEqual({ emoji: '🛒', formattedText: 'Compras ' });
    });

    it('should return null emoji if no emoji present', () => {
      const result = trimEmoji('Compras normais');
      expect(result).toEqual({ emoji: null, formattedText: 'Compras normais' });
    });
  });
});
