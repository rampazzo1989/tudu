import { apiRequest } from './client';
import {
  EmojiSuggestionRequest,
  ParsedListResult,
  ParseListRequest,
  TaskSuggestionRequest,
} from '../ai/types';

export const tuduApi = {
  auth: {
    loginWithGoogle: (idToken: string) =>
      apiRequest<{ user: any; accessToken: string }>('api/v1/auth/google', 'POST', { idToken }),

    loginWithApple: (identityToken: string, fullName?: string, email?: string) =>
      apiRequest<{ user: any; accessToken: string }>('api/v1/auth/apple', 'POST', {
        identityToken,
        fullName,
        email,
      }),

    devLogin: (email: string, name?: string) =>
      apiRequest<{ user: any; accessToken: string }>('api/v1/auth/dev', 'POST', { email, name }),
  },

  users: {
    getMe: () => apiRequest<any>('api/v1/users/me', 'GET'),
    deleteAccount: () => apiRequest<{ success: boolean }>('api/v1/users/me', 'DELETE'),
  },

  subscriptions: {
    getStatus: () =>
      apiRequest<{
        isPro: boolean;
        status: string;
        planId: string | null;
        price: string;
        trialEndsAt: string | null;
        currentPeriodEndsAt: string | null;
      }>('api/v1/subscriptions/status', 'GET'),

    devActivate: (isTrial: boolean = true) =>
      apiRequest<any>('api/v1/subscriptions/dev-activate', 'POST', { isTrial }),
  },

  ai: {
    suggestEmojis: (request: EmojiSuggestionRequest, signal?: AbortSignal) =>
      apiRequest<{ emojis: string[]; providerUsed: string }>(
        'api/v1/ai/suggest-emojis',
        'POST',
        {
          type: request.type,
          title: request.title,
          listName: request.listName,
        },
        { signal },
      ),

    suggestTasks: (request: TaskSuggestionRequest, signal?: AbortSignal) =>
      apiRequest<{ suggestions: string[]; providerUsed: string }>(
        'api/v1/ai/suggest-tasks',
        'POST',
        {
          listName: request.listName,
          existingTasks: request.existingTasks,
          currentInput: request.currentInput,
          count: request.count,
        },
        { signal },
      ),

    parseList: (request: ParseListRequest, signal?: AbortSignal) =>
      apiRequest<{ result: ParsedListResult; providerUsed: string }>(
        'api/v1/ai/parse-list',
        'POST',
        {
          rawText: request.rawText,
          orderingType: request.orderingType,
          customPrompt: request.customPrompt,
        },
        { signal },
      ),

    getQuota: () =>
      apiRequest<{
        dailyEmojiLimit: number;
        emojisUsedToday: number;
        emojisRemainingToday: number;
        dailyParseLimit: number;
        parsesUsedToday: number;
        parsesRemainingToday: number;
      }>('api/v1/ai/quota', 'GET'),
  },

  sync: {
    uploadSnapshot: (data: any) =>
      apiRequest<{ success: boolean; syncTimestamp: number; summary: any }>(
        'api/v1/sync/snapshot',
        'POST',
        { data },
      ),

    syncDelta: (delta: {
      lastSyncTimestamp: number;
      lists?: any[];
      tasks?: any[];
      counters?: any[];
      settings?: any;
    }) =>
      apiRequest<{
        syncTimestamp: number;
        delta: {
          lists: any[];
          tasks: any[];
          counters: any[];
          settings: any;
        };
      }>('api/v1/sync/delta', 'POST', delta),

    exportBackup: () => apiRequest<any>('api/v1/sync/export', 'GET'),
  },
};
