import GraphemeSplitter from 'grapheme-splitter';
import {getLastItem} from '../array-utils';

export const EMOJI_REGEX = /[\p{Emoji}\u200d]+/gu;
export const REMOVE_NUMBERS_REGEX = /^[\d]+/gu;

export const trimEmoji = (text: string) => {
  var splitter = new GraphemeSplitter();

  const splittedText = splitter.splitGraphemes(text);
  const firstEmoji = splittedText[0];

  const startsWithEmoji = !!firstEmoji.match(EMOJI_REGEX)?.length;

  if (startsWithEmoji && !firstEmoji.match(REMOVE_NUMBERS_REGEX)) {
    splittedText.shift();
    return {emoji: firstEmoji, formattedText: splittedText.join('')};
  }

  const lastEmoji = getLastItem(splittedText);

  const endsWithEmoji = !!lastEmoji?.match(EMOJI_REGEX)?.length;

  if (endsWithEmoji && !lastEmoji.match(REMOVE_NUMBERS_REGEX)) {
    splittedText.pop();
    return {emoji: lastEmoji, formattedText: splittedText.join('')};
  }
};
