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

type EmojiEntry = {
  key: string;
  values: string[];
};

export const useEmojiSearch = (debounceDelay: number) => {
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const emojiUsage = useRecoilValue(emojiUsageState); // Estado global persistido
  const searchCache = useRef<Map<string, string[]>>(new Map());
  const emojiEntries = useRef<EmojiEntry[]>([]);
  const lastSearch = useRef<{ words: string[], emojis: string[] }>({ words: [], emojis: [] });

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

  const selectWordsToSearch = useCallback((text: string) => {
    // Remove parameters from the text, if there are any:
    text = text.replace(PARAMETERS_REGEX, '').trim();
      
    let words = text.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      words = words.filter(
        (word) => word.length >= MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI
      ).slice(0, MAX_NUMBER_OF_WORDS);
    }
    return words;
  }, []);

  const searchEmojisByWords = useCallback(
    (words: string[]) => {
      
      if (words.length === 0) {
        return [];
      }

      var searchLimitPerWord = words.length === 1 
        ? 8 
        : words.length < 4
          ? 5
          : 3;

      if (emojiEntries.current.length === 0) {
        emojiEntries.current = Object.entries(emojis).map(([key, values]) => ({
          key,
          values,
        }));
      }

      const fuse = new Fuse(emojiEntries.current, {
        keys: ['values'],
        threshold: 0.25,
        distance: 100,
        includeScore: true,
        shouldSort: true,
      });

      let wordsWithoutCache: string[] = [];

      console.log('>>>>>>>>>>>>', words)


      const resultsFromCache = words.map((word) => {
        const cachedResult = searchCache.current.get(word)?.slice(0, searchLimitPerWord);
        if (cachedResult) {
          return cachedResult;
        } else {
          wordsWithoutCache.push(word);
          return null;
        }
      }).filter(x => !!x).flatMap(x => x) || [];

      const resultsWithoutCache = wordsWithoutCache
        .flatMap((word) => {
          const results = fuse
            .search(word, { limit: searchLimitPerWord })
            .map((x) => x);

          // Filtrar os resultados com base no top 10% dos scores
          const scores = results.map((x) => x.score ?? 0);
          const cutoff = scores.sort((a, b) => a - b)[Math.floor(scores.length * 0.1)]; // Top 10% cutoff
          const filteredResults = results.filter((x) => (x.score ?? 0) >= cutoff);

          searchCache.current.set(word, filteredResults.map((x) => x.item.key));
          return filteredResults.map((x) => x.item.key);
        });

      const resultSet = new Set<string>([...resultsFromCache, ...resultsWithoutCache]);

      return Array.from(resultSet);
    },
    [emojis, searchCache, emojiEntries]
  );

  const searchEmojis = useCallback((text: string) => {
    const words = selectWordsToSearch(text);
    return searchEmojisByWords(words);
  }, [selectWordsToSearch, searchEmojisByWords]);

  const getMostUsedEmojis = useCallback(() => {
    const sortedEmojis = Array.from(emojiUsage.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedEmojis.slice(0, 10).map(([emoji]) => emoji);
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
        const words = selectWordsToSearch(text);
        if (words.length && lastSearch.current.words.join('-') === words.join('-')) {
          callback(lastSearch.current.emojis, showingMostUsed);
          return;
        }
        beforeCallback?.();
        setTimeout(() => {
          var results = searchEmojisByWords(words);
          if (fallbackToMostUsed && results.length === 0) {
            results = getMostUsedEmojis();
            showingMostUsed = true;
          }
          lastSearch.current = { words, emojis: results };
          callback(results, showingMostUsed);
        }, 0);
      }, debounceDelay)();
    },
    [debounce, searchEmojisByWords, debounceDelay]
  );

  return { searchEmojis, debounceSearchEmojis, getMostUsedEmojis, getDefaultEmojis };
};