export type AIProvider = 'openai' | 'gemini' | 'claude';
export type AIFeature = 'emoji' | 'task_suggestions' | 'parse_list' | 'test';

export interface AISettings {
  provider: AIProvider;
  aiEmojiSuggestionsEnabled: boolean;
  hasApiKey: boolean;
}

export interface AITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIResponseWithUsage {
  content: string;
  usage?: AITokenUsage;
}

export interface AITokenUsageRecord {
  id: string;
  timestamp: number;
  provider: AIProvider;
  feature: AIFeature;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AITokenUsageState {
  records: AITokenUsageRecord[];
  lastResetAt: string | null;
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

export type AIOrderingType = 'none' | 'smart' | 'custom';

export interface ParseListRequest {
  rawText: string;
  orderingType?: AIOrderingType;
  customPrompt?: string;
}

export interface ParsedSectionResult {
  title: string;
  items: string[];
}

export interface ParsedListResult {
  title: string;
  items: string[];
  sections?: ParsedSectionResult[];
}

export interface ParsedListItem {
  id: string;
  label: string;
  selected: boolean;
  sectionTitle?: string;
}

export interface ParsedSectionGroup {
  title: string;
  items: ParsedListItem[];
}

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  placeholder: string;
  helpUrl: string;
}



