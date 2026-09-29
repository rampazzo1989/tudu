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

  // If storePriceString already contains period indicator, return as is
  if (
    storePriceString.includes('/') ||
    storePriceString.includes('mês') ||
    storePriceString.includes('month') ||
    storePriceString.includes('mes') ||
    storePriceString.includes('mese')
  ) {
    return storePriceString.trim();
  }

  return `${storePriceString.trim()} ${period}`;
}
