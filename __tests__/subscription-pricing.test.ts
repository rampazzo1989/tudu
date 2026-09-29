import {
  formatPriceWithPeriod,
  getPeriodSuffix,
} from '../src/service/subscription/subscription-pricing';

jest.mock('i18next', () => ({
  __esModule: true,
  default: {
    language: 'pt-BR',
  },
  language: 'pt-BR',
}));

describe('subscription-pricing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPeriodSuffix', () => {
    it('returns correct period suffix for each language', () => {
      expect(getPeriodSuffix('pt-BR')).toBe('/mês');
      expect(getPeriodSuffix('es')).toBe('/mes');
      expect(getPeriodSuffix('it')).toBe('/mese');
      expect(getPeriodSuffix('en')).toBe('/month');
    });
  });

  describe('formatPriceWithPeriod', () => {
    it('formats store price with localized period suffix', () => {
      expect(formatPriceWithPeriod('1,00 €', 'it')).toBe('1,00 € /mese');
      expect(formatPriceWithPeriod('R$ 6,10', 'pt-BR')).toBe('R$ 6,10 /mês');
      expect(formatPriceWithPeriod('$1.08', 'en')).toBe('$1.08 /month');
    });

    it('preserves store price if it already includes period suffix', () => {
      expect(formatPriceWithPeriod('R$ 6,49/mês', 'pt-BR')).toBe('R$ 6,49/mês');
    });

    it('returns null when store price is null, undefined, or empty to prevent misleading estimates', () => {
      expect(formatPriceWithPeriod(null, 'pt-BR')).toBeNull();
      expect(formatPriceWithPeriod(undefined, 'en')).toBeNull();
      expect(formatPriceWithPeriod('', 'es')).toBeNull();
      expect(formatPriceWithPeriod('   ', 'it')).toBeNull();
    });
  });
});
