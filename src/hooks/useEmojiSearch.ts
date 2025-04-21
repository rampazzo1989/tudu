import { useCallback, useMemo, useRef } from 'react';
import { getLocales } from 'react-native-localize';
import emojisPtBr from 'emojilib-pt-br/dist/emoji-pt-BR.json';
import emojisEn from 'emojilib-pt-br/dist/emoji-en-US.json';
import Fuse from 'fuse.js';
import { useRecoilValue } from 'recoil';
import { emojiUsageState } from '../state/atoms';
import { PARAMETERS_REGEX } from '../constants';

const MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI = 3;
const MAX_NUMBER_OF_WORDS = 6;

export const useEmojiSearch = (debounceDelay: number) => {
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const emojiUsage = useRecoilValue(emojiUsageState); // Estado global persistido

  const emojis = useMemo(() => {
    const language = getLocales()[0].languageTag;
    return language.startsWith('pt-BR') ? emojisPtBr : emojisEn;
  }, []);

  const debounce = useCallback((func: () => void, delay: number) => {
    return () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(func, delay);
    };
  }, []);

  const searchEmojis = useCallback(
    (text: string) => {
      // Remove parameters from the text, if there are any:
      text = text.replace(PARAMETERS_REGEX, '').trim();
      
      let words = text.split(/\s+/).filter(Boolean);
      if (words.length > 1) {
        words = words.filter(
          (word) => word.length >= MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI
        ).slice(0, MAX_NUMBER_OF_WORDS);
      }

      var searchLimitPerWord = words.length === 1 
        ? 8 
        : words.length < 4
          ? 5
          : 3;

      const emojiEntries = Object.entries(emojis).map(([key, values]) => ({
        key,
        values,
      }));
      const fuse = new Fuse(emojiEntries, {
        keys: ['values'],
        threshold: 0.25,
        distance: 100,
        includeScore: true,
      });

      const resultSet = new Set(
        words
          .flatMap((word) =>
            fuse
              .search(word, { limit: searchLimitPerWord })
          )
          .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
          .map((x) => x.item.key)
      );

      return Array.from(resultSet);
    },
    [emojis]
  );

  const getMostUsedEmojis = useCallback(() => {
    const sortedEmojis = Array.from(emojiUsage.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedEmojis.slice(0, 20).map(([emoji]) => emoji);
  }, [emojiUsage]);

  const getDefaultEmojis = useCallback((type: "tudu" | "list") => {
    const defaultEmojis = {
      tudu: [
        '✅', '📝', '📅', '⏳', '🔔', '📌', '⭐', '🔑', '📍', '🎯'
      ],
      list: [
        '🗂️', '📁', '🗃️', '📊', '📈', '📉', '📋', '🗒️'
      ]
    };
    return defaultEmojis[type];
  }
  , []);

  const debounceSearchEmojis = useCallback(
    (text: string, callback: (results: string[], isShowingMostUsed: boolean) => void, 
    fallbackToMostUsed: boolean = true, beforeCallback: undefined | (() => void) = undefined) => {
      var showingMostUsed = false;
      debounce(() => {
        beforeCallback?.();
        setTimeout(() => {
          var results = searchEmojis(text);
          if (fallbackToMostUsed && results.length === 0) {
            results = getMostUsedEmojis();
            showingMostUsed = true;
          }
          callback(results, showingMostUsed);
        }, 0);
      }, debounceDelay)();
    },
    [debounce, searchEmojis, debounceDelay]
  );

  return { searchEmojis, debounceSearchEmojis, getMostUsedEmojis, getDefaultEmojis };
};