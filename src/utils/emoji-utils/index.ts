import GraphemeSplitter from 'grapheme-splitter';
import {getLastItem} from '../array-utils';

export const EMOJI_REGEX = /[\p{Emoji}\u200d]+/gu;
export const REMOVE_NUMBERS_REGEX = /^[\d]+/gu;


/**
 * Trims an emoji from the beginning or end of a given text string.
 *
 * @param text - The input string that may contain an emoji at the start or end.
 * @returns An object containing the trimmed emoji and the formatted text without the emoji,
 *          or undefined if the input text is empty or no emoji is found at the start or end.
 */
export const trimEmoji = (text: string, side: "start" | "end" | "both" = "both") => {
  if (text === '') {
    return;
  }
  var splitter = new GraphemeSplitter();

  var trimmedText = text.trim();

  const splittedText = splitter.splitGraphemes(trimmedText);
  const firstEmoji = splittedText[0];
  // console.log({splittedText, firstEmoji});

  if (side === "start" || side === "both") {
    const startsWithEmoji = !!firstEmoji.match(EMOJI_REGEX)?.length;

    if (startsWithEmoji && !firstEmoji.match(REMOVE_NUMBERS_REGEX)) {
      splittedText.shift();
      return {emoji: firstEmoji, formattedText: splittedText.join('')};
    }
  }
  if (side === "end" || side === "both") {
    const lastEmoji = getLastItem(splittedText);
    
    const endsWithEmoji = !!lastEmoji?.match(EMOJI_REGEX)?.length;
    // console.log({splittedText, lastEmoji, endsWithEmoji});

    if (endsWithEmoji && !lastEmoji.match(REMOVE_NUMBERS_REGEX)) {
      splittedText.pop();
      return {emoji: lastEmoji, formattedText: splittedText.join('')};
    }
  }

  return {emoji: null, formattedText: text};
};
