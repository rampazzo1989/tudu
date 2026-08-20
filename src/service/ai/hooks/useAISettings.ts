import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {aiSettingsState, AISettingsState} from '../../../state/atoms';
import {AIProvider} from '../types';
import {
  getSecureApiKey,
  setSecureApiKey,
  deleteSecureApiKey,
  hasSecureApiKey,
} from '../secure-storage';

export const useAISettings = () => {
  const [settings, setSettings] = useRecoilState(aiSettingsState);

  const setProvider = useCallback(
    (provider: AIProvider) => {
      const hasKey = hasSecureApiKey(provider);
      setSettings(prev => ({
        ...prev,
        provider,
        hasApiKey: hasKey,
        // If current provider has key and suggestions was enabled, keep it; else update
        aiEmojiSuggestionsEnabled: hasKey ? prev.aiEmojiSuggestionsEnabled : false,
      }));
    },
    [setSettings],
  );

  const saveApiKey = useCallback(
    (provider: AIProvider, apiKey: string) => {
      const trimmed = apiKey.trim();
      if (trimmed.length > 0) {
        setSecureApiKey(provider, trimmed);
        setSettings(prev => ({
          ...prev,
          provider,
          hasApiKey: true,
          aiEmojiSuggestionsEnabled: true, // Auto-enable by default when key is provided as requested
        }));
      }
    },
    [setSettings],
  );

  const removeApiKey = useCallback(
    (provider: AIProvider) => {
      deleteSecureApiKey(provider);
      setSettings(prev => ({
        ...prev,
        hasApiKey: false,
        aiEmojiSuggestionsEnabled: false,
      }));
    },
    [setSettings],
  );

  const toggleEmojiSuggestions = useCallback(
    (enabled: boolean) => {
      setSettings(prev => ({
        ...prev,
        aiEmojiSuggestionsEnabled: enabled,
      }));
    },
    [setSettings],
  );

  const getCurrentApiKey = useCallback(() => {
    return getSecureApiKey(settings.provider);
  }, [settings.provider]);

  return {
    settings,
    setProvider,
    saveApiKey,
    removeApiKey,
    toggleEmojiSuggestions,
    getCurrentApiKey,
  };
};
