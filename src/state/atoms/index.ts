import {atom} from 'recoil';
import {IdlyAnimatedComponent} from './types';
import React from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import { mmkvPersistAtom } from '../../utils/state-utils/mmkv-persist-atom';
import { TuduViewModel } from '../../scenes/home/types';
import { NotificationSound, DEFAULT_NOTIFICATION_SOUND } from '../../service/notification/types';

export const idlyAnimatedComponents = atom<IdlyAnimatedComponent[]>({
  key: 'idlyAnimatedComponents',
  default: [],
});

export const currentlyOpenSwipeableRef = atom<React.RefObject<Swipeable>>({
  key: 'currentlyOpenSwipeableRef',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const toastSpan = atom<number>({
  key: 'toastSpan',
  default: 0,
});

export const emojiUsageState = atom<Map<string, number>>({
  key: 'emojiUsageState',
  default: new Map<string, number>(),
  effects: [mmkvPersistAtom('emojiUsageState', true)],
});

export const showOutdatedTudus = atom<boolean>({
  key: 'showOutdatedTudus',
  default: false,
});

export const recalculateRecurrence = atom<TuduViewModel | undefined>({
  key: 'recalculateRecurrence',
  default: undefined,
});

export interface AISettingsState {
  provider: 'openai' | 'gemini' | 'claude';
  aiEmojiSuggestionsEnabled: boolean;
  hasApiKey: boolean;
}

export const aiSettingsState = atom<AISettingsState>({
  key: 'aiSettingsState',
  default: {
    provider: 'gemini',
    aiEmojiSuggestionsEnabled: false,
    hasApiKey: false,
  },
  effects: [mmkvPersistAtom('aiSettingsState')],
});

export interface NotificationSettingsState {
  timedNotificationsEnabled: boolean;
  dailyDigestEnabled: boolean;
  dailyDigestHour: number;
  dailyDigestMinute: number;
  notificationSound?: NotificationSound;
  callRemindersEnabled?: boolean;
  ttsVoiceRate?: number;
  callReminderSuggestionDismissed?: boolean;
  hasScheduledWithTime?: boolean;
}

export const notificationSettingsState = atom<NotificationSettingsState>({
  key: 'notificationSettingsState',
  default: {
    timedNotificationsEnabled: true,
    dailyDigestEnabled: true,
    dailyDigestHour: 8,
    dailyDigestMinute: 30,
    notificationSound: DEFAULT_NOTIFICATION_SOUND,
    callRemindersEnabled: false,
    ttsVoiceRate: 0.5,
    callReminderSuggestionDismissed: false,
    hasScheduledWithTime: false,
  },
  effects: [mmkvPersistAtom('notificationSettingsState')],
});

export interface BackupGoogleUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

export type AutoBackupFrequency = 'daily' | 'weekly' | 'on_change';

export interface BackupSettingsState {
  googleUser: BackupGoogleUser | null;
  lastCloudBackupDate: string | null;
  lastLocalBackupDate: string | null;
  autoBackupEnabled: boolean;
  autoBackupFrequency: AutoBackupFrequency;
  reminderEnabled: boolean;
  reminderIntervalDays: number;
  lastReminderDismissedDate: string | null;
  includeSettingsInBackup: boolean;
  lastAutoBackupError: string | null;
  lastAutoBackupErrorDate: string | null;
}

export const backupSettingsState = atom<BackupSettingsState>({
  key: 'backupSettingsState',
  default: {
    googleUser: null,
    lastCloudBackupDate: null,
    lastLocalBackupDate: null,
    autoBackupEnabled: false,
    autoBackupFrequency: 'daily',
    reminderEnabled: true,
    reminderIntervalDays: 7,
    lastReminderDismissedDate: null,
    includeSettingsInBackup: true,
    lastAutoBackupError: null,
    lastAutoBackupErrorDate: null,
  },
  effects: [mmkvPersistAtom('backupSettingsState')],
});

export interface AITokenUsageRecord {
  id: string;
  timestamp: number;
  provider: 'openai' | 'gemini' | 'claude';
  feature: 'emoji' | 'task_suggestions' | 'parse_list' | 'test';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AITokenUsageState {
  records: AITokenUsageRecord[];
  lastResetAt: string | null;
}

export const aiTokenUsageState = atom<AITokenUsageState>({
  key: 'aiTokenUsageState',
  default: {
    records: [],
    lastResetAt: null,
  },
  effects: [mmkvPersistAtom('aiTokenUsageState')],
});

export type LockTimeoutOption = 'immediate' | '1m' | '5m' | '15m';

export interface SecuritySettingsState {
  isLockEnabled: boolean;
  pinHash: string | null;
  pinSalt: string | null;
  isBiometricsEnabled: boolean;
  lockTimeout: LockTimeoutOption;
  failedAttempts: number;
  lockoutUntil: number | null;
}

export const securitySettingsState = atom<SecuritySettingsState>({
  key: 'securitySettingsState',
  default: {
    isLockEnabled: false,
    pinHash: null,
    pinSalt: null,
    isBiometricsEnabled: false,
    lockTimeout: 'immediate',
    failedAttempts: 0,
    lockoutUntil: null,
  },
  effects: [mmkvPersistAtom('securitySettingsState')],
});

export interface AppLockSessionState {
  isAppLocked: boolean;
  lastBackgroundAt: number | null;
}

export const appLockSessionState = atom<AppLockSessionState>({
  key: 'appLockSessionState',
  default: {
    isAppLocked: false,
    lastBackgroundAt: null,
  },
});


