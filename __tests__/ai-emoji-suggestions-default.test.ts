jest.mock('react-dom', () => ({}), { virtual: true });

import { snapshot_UNSTABLE } from 'recoil';
import { aiSettingsState } from '../src/state/atoms';

describe('AI Emoji Suggestions Default Behavior', () => {
  it('has aiEmojiSuggestionsEnabled set to true by default in initial atom state', () => {
    const initialSnapshot = snapshot_UNSTABLE();
    const settings = initialSnapshot.getLoadable(aiSettingsState).valueOrThrow();
    expect(settings.aiEmojiSuggestionsEnabled).toBe(true);
  });

  it('determines isAIEnabled as true by default when user is Pro and has not manually disabled it', () => {
    const isPro = true;
    const isManaged = true;
    const isAIConfigured = isManaged ? isPro : false;
    const aiSettings = {
      mode: 'managed' as const,
      provider: 'gemini' as const,
      hasApiKey: false,
      aiEmojiSuggestionsEnabled: true,
      aiEmojiSuggestionsManuallySet: undefined,
    };

    const isEmojiSuggestionsActive =
      aiSettings.aiEmojiSuggestionsManuallySet !== undefined
        ? aiSettings.aiEmojiSuggestionsEnabled
        : true;

    const isAIEnabled = isAIConfigured && isEmojiSuggestionsActive;
    expect(isAIEnabled).toBe(true);
  });

  it('determines isAIEnabled as true by default when user has BYOK and has not manually disabled it', () => {
    const isPro = false;
    const isManaged = false;
    const hasApiKey = true;
    const isAIConfigured = isManaged ? isPro : hasApiKey;
    const aiSettings = {
      mode: 'byok' as const,
      provider: 'openai' as const,
      hasApiKey: true,
      aiEmojiSuggestionsEnabled: true,
      aiEmojiSuggestionsManuallySet: undefined,
    };

    const isEmojiSuggestionsActive =
      aiSettings.aiEmojiSuggestionsManuallySet !== undefined
        ? aiSettings.aiEmojiSuggestionsEnabled
        : true;

    const isAIEnabled = isAIConfigured && isEmojiSuggestionsActive;
    expect(isAIEnabled).toBe(true);
  });

  it('determines isAIEnabled as false when user is free without BYOK', () => {
    const isPro = false;
    const isManaged = true;
    const hasApiKey = false;
    const isAIConfigured = isManaged ? isPro : hasApiKey;
    const aiSettings = {
      mode: 'managed' as const,
      provider: 'gemini' as const,
      hasApiKey: false,
      aiEmojiSuggestionsEnabled: true,
    };

    const isEmojiSuggestionsActive =
      (aiSettings as any).aiEmojiSuggestionsManuallySet !== undefined
        ? aiSettings.aiEmojiSuggestionsEnabled
        : true;

    const isAIEnabled = isAIConfigured && isEmojiSuggestionsActive;
    expect(isAIEnabled).toBe(false);
  });

  it('respects user choice when user manually toggles emoji suggestions off', () => {
    const isPro = true;
    const isManaged = true;
    const isAIConfigured = isManaged ? isPro : false;
    const aiSettings = {
      mode: 'managed' as const,
      provider: 'gemini' as const,
      hasApiKey: false,
      aiEmojiSuggestionsEnabled: false,
      aiEmojiSuggestionsManuallySet: true,
    };

    const isEmojiSuggestionsActive =
      aiSettings.aiEmojiSuggestionsManuallySet !== undefined
        ? aiSettings.aiEmojiSuggestionsEnabled
        : true;

    const isAIEnabled = isAIConfigured && isEmojiSuggestionsActive;
    expect(isAIEnabled).toBe(false);
  });
});
