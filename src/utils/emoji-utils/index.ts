export const EMOJI_REGEX = /^[\p{Emoji}\u200d]+/gu;

export const getEmojiFromBeginning = (text: string) => {
  const emojis = text.match(EMOJI_REGEX);
  if (!emojis?.length || emojis.length > 3) {
    return;
  }
  let emojiList: string[] = [];

  for (const emoji of emojis) {
    emojiList.push(emoji);
  }

  return emojiList.join('');
};

export const removeEmojiFromBeginning = (text: string) => {
  const remainingText = text.replace(EMOJI_REGEX, '')?.trim();
  return remainingText.length > 0 ? remainingText : text;
};
