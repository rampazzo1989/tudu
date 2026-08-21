export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface AISettings {
  provider: AIProvider;
  aiEmojiSuggestionsEnabled: boolean;
  hasApiKey: boolean;
}

export interface EmojiSuggestionRequest {
  type: 'list' | 'tudu';
  title: string;
  listName?: string;
}

export interface TaskSuggestionRequest {
  listName: string;
  existingTasks?: string[];
  currentInput?: string;
  count?: number;
}

export interface TaskSuggestionItem {
  id: string;
  label: string;
  selected: boolean;
}

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  placeholder: string;
  helpUrl: string;
}

