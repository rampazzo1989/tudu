import { Dimensions } from 'react-native';

/**
 * Estimates the width in dp of a header title rendered with Inter-SemiBold at 22px.
 * Used to render the header pill at the correct width on Frame 0 without waiting
 * for asynchronous onLayout measurements or causing layout shift / clipping.
 */
export function estimateTitleWidth(text?: string): number {
  if (!text) return 50;

  const trimmed = text.trim();
  if (!trimmed) return 50;

  let width = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    const code = char.charCodeAt(0);

    // Narrow chars: i, j, l, 1, punctuation, space
    if (
      code === 32 ||
      char === 'i' ||
      char === 'j' ||
      char === 'l' ||
      char === '1' ||
      char === '!' ||
      char === '|' ||
      char === '.' ||
      char === ',' ||
      char === ':' ||
      char === ';' ||
      char === '\'' ||
      char === '-' ||
      char === '(' ||
      char === ')'
    ) {
      width += 6.5;
    }
    // Wide chars: W, M, emojis, symbols
    else if (
      char === 'W' ||
      char === 'M' ||
      char === '@' ||
      char === '%' ||
      char === '&' ||
      char === 'Q' ||
      code > 255
    ) {
      width += 18.5;
    }
    // Uppercase letters & numbers
    else if (
      (code >= 65 && code <= 90) ||
      (code >= 48 && code <= 57) ||
      (code >= 192 && code <= 221)
    ) {
      width += 15;
    }
    // Lowercase wide: m, w
    else if (char === 'm' || char === 'w') {
      width += 16.5;
    }
    // Lowercase narrow: r, s, t, f
    else if (char === 'r' || char === 's' || char === 't' || char === 'f') {
      width += 9;
    }
    // Standard lowercase (a, b, c, d, e, g, h, k, n, o, p, q, u, v, x, y, z and accented)
    else {
      width += 12.5;
    }
  }

  // Add small cushion for letter-spacing and subpixel rendering
  const estimated = width + 8;

  // Header TitleContainer has max-width: 72%.
  // BackButton (48) + margin (12) = 60dp.
  // Maximum single-line Title width before wrapping is (screenWidth * 0.72) - 60.
  const screenWidth = Dimensions.get('window').width || 393;
  const maxTitleWidth = Math.max(160, screenWidth * 0.72 - 60);

  return Math.min(estimated, maxTitleWidth);
}
