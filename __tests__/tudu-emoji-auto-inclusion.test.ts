import { hasEmoji, trimEmoji } from '../src/utils/emoji-utils';

describe('Tudu Emoji Auto-Inclusion Logic', () => {
  it('correctly detects whether a tudu label contains an emoji', () => {
    expect(hasEmoji('Comprar pão')).toBe(false);
    expect(hasEmoji('🥖 Comprar pão')).toBe(true);
    expect(hasEmoji('Comprar pão 🥖')).toBe(true);
    expect(hasEmoji('123 tarefa importante')).toBe(false);
    expect(hasEmoji('1️⃣ primeira prioridade')).toBe(true);
  });

  it('prepends first suggested emoji when text has no emoji and suggestions are real', () => {
    const text = 'comprar pão';
    const suggestions = ['🥖', '🍞', '🥐'];
    const isShowingMostUsed = false;
    const userOptedOut = false;

    let finalLabel = text;
    if (!hasEmoji(text) && !userOptedOut && !isShowingMostUsed && suggestions.length > 0) {
      finalLabel = `${suggestions[0]} ${text}`.trim();
    }

    expect(finalLabel).toBe('🥖 comprar pão');
  });

  it('does NOT prepend emoji when suggestions fall back to most used', () => {
    const text = 'qwerty zxcv';
    const suggestions = ['✅', '📝', '📅'];
    const isShowingMostUsed = true;
    const userOptedOut = false;

    let finalLabel = text;
    if (!hasEmoji(text) && !userOptedOut && !isShowingMostUsed && suggestions.length > 0) {
      finalLabel = `${suggestions[0]} ${text}`.trim();
    }

    expect(finalLabel).toBe('qwerty zxcv');
  });

  it('does NOT prepend emoji when text already has an emoji', () => {
    const text = '🥖 comprar pão';
    const suggestions = ['🍞', '🥐'];
    const isShowingMostUsed = false;
    const userOptedOut = false;

    let finalLabel = text;
    if (!hasEmoji(text) && !userOptedOut && !isShowingMostUsed && suggestions.length > 0) {
      finalLabel = `${suggestions[0]} ${text}`.trim();
    }

    expect(finalLabel).toBe('🥖 comprar pão');
  });

  it('does NOT prepend emoji when user opted out by deselecting', () => {
    const text = 'comprar pão';
    const suggestions = ['🥖', '🍞'];
    const isShowingMostUsed = false;
    const userOptedOut = true;

    let finalLabel = text;
    if (!hasEmoji(text) && !userOptedOut && !isShowingMostUsed && suggestions.length > 0) {
      finalLabel = `${suggestions[0]} ${text}`.trim();
    }

    expect(finalLabel).toBe('comprar pão');
  });

  it('trims leading emoji cleanly when user deselects emoji', () => {
    const textWithEmoji = '🥖 comprar pão';
    const trimmed = trimEmoji(textWithEmoji, 'start');
    const labelWithoutEmoji = (trimmed?.emoji ? trimmed.formattedText : textWithEmoji).trim();

    expect(labelWithoutEmoji).toBe('comprar pão');
  });

  it('updates text with pre-selected emoji as if user tapped the button', () => {
    let currentLabel = 'Comprar Uva';
    const bestEmoji = '🍇';

    const trimmed = trimEmoji(currentLabel, 'start');
    const cleanLabel = (trimmed?.emoji ? trimmed.formattedText : currentLabel).trim();
    currentLabel = `${bestEmoji} ${cleanLabel}`.trim();

    expect(currentLabel).toBe('🍇 Comprar Uva');

    // If a new suggestion arrives (e.g. user typed more), cleanly replace with the new top emoji
    const nextEmoji = '🍷';
    const trimmedNext = trimEmoji(currentLabel, 'start');
    const cleanLabelNext = (trimmedNext?.emoji ? trimmedNext.formattedText : currentLabel).trim();
    currentLabel = `${nextEmoji} ${cleanLabelNext}`.trim();

    expect(currentLabel).toBe('🍷 Comprar Uva');
  });
});

