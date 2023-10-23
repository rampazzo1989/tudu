import GraphemeSplitter from 'grapheme-splitter';

export const EMOJI_BEGGINING_REGEX = /^[\p{Emoji}\u200d]+/gu;
export const EMOJI_END_REGEX = /[\p{Emoji}\u200d]+$/gu;
export const EMOJI_REGEX = /[\p{Emoji}\u200d]+/gu;

export const getFirstEmoji = (text: string) => {
  const emojis = text.match(EMOJI_REGEX);
  if (!emojis?.length || emojis.length > 3) {
    return;
  }

  var splitter = new GraphemeSplitter();

  const splittedEmojis = splitter.splitGraphemes(emojis[0]);

  return splittedEmojis[0];
};

/**
 * Removes the first emoji found if it's in the beggining or in the end of the text.
 */
export const trimFirstEmoji = (text: string) => {
  const emojisFromHead = text.match(EMOJI_BEGGINING_REGEX);
  const emojisFromTail = text.match(EMOJI_END_REGEX);
  if (!emojisFromHead?.length && !emojisFromTail?.length) {
    return text;
  }

  const firstEmojiSet = emojisFromHead?.[0] ?? emojisFromTail?.[0] ?? '';
  var splitter = new GraphemeSplitter();

  const splittedEmojis = splitter.splitGraphemes(firstEmojiSet);

  return splittedEmojis?.length ? text.replace(splittedEmojis[0], '') : text;
};
