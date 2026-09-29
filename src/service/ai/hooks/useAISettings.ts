import {useCallback, useEffect} from 'react';
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

  // Auto-enable AI emoji suggestions by default if user hasn't explicitly toggled it
  useEffect(() => {
    if (settings.aiEmojiSuggestionsManuallySet === undefined && !settings.aiEmojiSuggestionsEnabled) {
      setSettings(prev => ({
        ...prev,
        aiEmojiSuggestionsEnabled: true,
      }));
    }
  }, [settings.aiEmojiSuggestionsManuallySet, settings.aiEmojiSuggestionsEnabled, setSettings]);

  const setProvider = useCallback(
    (provider: AIProvider) => {
      const hasKey = hasSecureApiKey(provider);
      setSettings(prev => ({
        ...prev,
        provider,
        hasApiKey: hasKey,
        // Auto-enable if hasKey and not explicitly disabled
        aiEmojiSuggestionsEnabled: hasKey
          ? (prev.aiEmojiSuggestionsManuallySet !== undefined ? prev.aiEmojiSuggestionsEnabled : true)
          : false,
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
        aiEmojiSuggestionsManuallySet: true,
      }));
    },
    [setSettings],
  );

  const getCurrentApiKey = useCallback(() => {
    return getSecureApiKey(settings.provider);
  }, [settings.provider]);

  const setAIMode = useCallback(
    (mode: 'managed' | 'byok') => {
      setSettings(prev => ({
        ...prev,
        mode,
      }));
    },
    [setSettings],
  );

  return {
    settings,
    setAIMode,
    setProvider,
    saveApiKey,
    removeApiKey,
    toggleEmojiSuggestions,
    getCurrentApiKey,
  };
};
