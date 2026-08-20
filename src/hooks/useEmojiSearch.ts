import { useCallback, useMemo, useRef } from 'react';
import { getLocales } from 'react-native-localize';
import emojisPtBr from 'emojilib-pt-br/dist/emoji-pt-BR.json';
import emojisEn from 'emojilib-pt-br/dist/emoji-en-US.json';
import emojisEs from 'emojilib-pt-br/dist/emoji-es.json';
import emojisIt from 'emojilib-pt-br/dist/emoji-it.json';
import Fuse from 'fuse.js';
import { useRecoilValue } from 'recoil';
import { aiSettingsState, emojiUsageState } from '../state/atoms';
import { PARAMETERS_REGEX } from '../constants';
import { suggestEmojisWithAI } from '../service/ai';

const MINIMUM_TEXT_SIZE_TO_SUGGEST_EMOJI = 3;
const MAX_NUMBER_OF_WORDS = 6;

type EmojiEntry = {
  key: string;
  values: string[];
};

export interface EmojiSearchContext {
  type?: 'list' | 'tudu';
  listName?: string;
}

const emojisDictionary = {
  'pt': emojisPtBr,
  'en': emojisEn,
  'es': emojisEs,
  'it': emojisIt,
};

export const useEmojiSearch = (debounceDelay: number = 1200) => {
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const emojiUsage = useRecoilValue(emojiUsageState); // Estado global persistido
  const aiSettings = useRecoilValue(aiSettingsState); // Configurações de IA
  const searchCache = useRef<Map<string, string[]>>(new Map());
  const emojiEntries = useRef<EmojiEntry[]>([]);
  const lastSearch = useRef<{
    queryKey: string;
    emojis: string[];
    isShowingMostUsed: boolean;
    isAIGenerated: boolean;
  }>({
    queryKey: '',
    emojis: [],
    isShowingMostUsed: false,
    isAIGenerated: false,
  });

  const emojis = useMemo(() => {
    const language = getLocales()[0].languageTag;
    const languageWithoutRegion = language.split('-')[0];
    return emojisDictionary[languageWithoutRegion as keyof typeof emojisDictionary] || emojisDictionary['en'];
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
  }, []);

  const debounceSearchEmojis = useCallback(
    (
      text: string,
      callback: (
        results: string[],
        isShowingMostUsed: boolean,
        isAIGenerated: boolean,
      ) => void, 
      fallbackToMostUsed: boolean = true,
      beforeCallback?: () => void,
      context?: EmojiSearchContext,
    ) => {
      debounce(async () => {
        // Normalizes spaces, removes parameters
        const cleanText = text
          .replace(PARAMETERS_REGEX, '')
          .replace(/\s+/g, ' ')
          .trim();

        const queryKey = `${context?.type ?? 'tudu'}:${
          context?.listName ? context.listName.replace(/\s+/g, ' ').trim().toLowerCase() : ''
        }:${cleanText.toLowerCase()}`;

        // Return immediately if the normalized query has not changed
        if (
          lastSearch.current.queryKey === queryKey &&
          lastSearch.current.emojis.length > 0
        ) {
          callback(
            lastSearch.current.emojis,
            lastSearch.current.isShowingMostUsed,
            lastSearch.current.isAIGenerated,
          );
          return;
        }

        // 1. Try AI-powered suggestion if configured, enabled and text is meaningful
        if (
          aiSettings.hasApiKey &&
          aiSettings.aiEmojiSuggestionsEnabled &&
          cleanText.length >= 2
        ) {
          console.log(`✨ [useEmojiSearch] Disparando busca por IA (${aiSettings.provider}) para "${cleanText}"...`);
          beforeCallback?.();
          try {
            const aiEmojis = await suggestEmojisWithAI(aiSettings.provider, {
              type: context?.type ?? 'tudu',
              title: cleanText,
              listName: context?.listName,
            });

            if (aiEmojis && aiEmojis.length > 0) {
              console.log(`🎯 [useEmojiSearch] Atualizando modais com ${aiEmojis.length} emojis da IA`);
              lastSearch.current = {
                queryKey,
                emojis: aiEmojis,
                isShowingMostUsed: false,
                isAIGenerated: true,
              };
              callback(aiEmojis, false, true);
              return;
            }
          } catch (error: any) {
            console.warn(`⚠️ [useEmojiSearch] Falha na IA, usando busca offline como fallback:`, error?.message || error);
          }
        } else {
          console.log(`ℹ️ [useEmojiSearch] Busca offline direta (IA desativada ou sem chave). Texto: "${cleanText}"`);
        }

        // 2. Offline fallback (Fuse.js fuzzy search)
        const words = selectWordsToSearch(text);
        beforeCallback?.();
        setTimeout(() => {
          let results = searchEmojisByWords(words);
          let showingMostUsed = false;
          if (fallbackToMostUsed && results.length === 0) {
            results = getMostUsedEmojis();
            showingMostUsed = true;
          }
          lastSearch.current = {
            queryKey,
            emojis: results,
            isShowingMostUsed: showingMostUsed,
            isAIGenerated: false,
          };
          callback(results, showingMostUsed, false);
        }, 0);
      }, debounceDelay)();
    },
    [
      debounce,
      aiSettings,
      selectWordsToSearch,
      searchEmojisByWords,
      getMostUsedEmojis,
      debounceDelay,
    ]
  );

  return {
    searchEmojis,
    debounceSearchEmojis,
    getMostUsedEmojis,
    getDefaultEmojis,
    isAIEnabled: aiSettings.hasApiKey && aiSettings.aiEmojiSuggestionsEnabled,
  };
};