import i18next from 'i18next';

/**
 * Returns localized period suffix (e.g. "/mês", "/month", "/mes", "/mese").
 */
export function getPeriodSuffix(lang?: string): string {
  const currentLang = (lang || i18next.language || 'en').toLowerCase();

  if (currentLang.startsWith('pt')) {
    return '/mês';
  }
  if (currentLang.startsWith('es')) {
    return '/mes';
  }
  if (currentLang.startsWith('it')) {
    return '/mese';
  }
  return '/month';
}

/**
 * Formats a price string from the store (e.g. "R$ 6,49", "1,00 €", "$1.08") with its recurring period suffix.
 * Returns null if the store price is not loaded yet, avoiding any hardcoded estimates or misleading copy.
 */
export function formatPriceWithPeriod(storePriceString?: string | null, lang?: string): string | null {
  if (!storePriceString || !storePriceString.trim()) {
    return null;
  }

  const period = getPeriodSuffix(lang);
  let cleaned = storePriceString.trim();

  // Strip Google Play sandbox/test accelerated intervals like "/ 5 min", "/5 min", "/ 5m", "/5m", "/ 5 mins"
  cleaned = cleaned.replace(/\s*\/\s*\d+\s*(min|m|mins|minutes)\b/gi, '').trim();

  // If storePriceString already contains a valid monthly period indicator, return cleaned
  if (
    cleaned.includes('mês') ||
    cleaned.includes('month') ||
    cleaned.includes('mes') ||
    cleaned.includes('mese')
  ) {
    return cleaned;
  }

  // If there is any remaining slash-separated abbreviation (e.g. "/mo"), strip it so we use the unified localized suffix
  cleaned = cleaned.replace(/\s*\/\s*(mo|m|yr|y|week|w)\b/gi, '').trim();

  return `${cleaned} ${period}`;
}
