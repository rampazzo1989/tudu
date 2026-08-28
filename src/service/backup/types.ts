import { Counter, List, TuduItem } from '../../scenes/home/types';
import {
  AITokenUsageState,
  AISettingsState,
  AutoBackupFrequency,
  LockTimeoutOption,
  NotificationSettingsState,
} from '../../state/atoms';

export interface TuduBackupMetadata {
  version: number;
  appName: string;
  appVersion: string;
  createdAt: string;
  platform: 'android' | 'ios' | 'unknown';
  summary: {
    listsCount: number;
    tudusCount: number;
    countersCount: number;
    archivedListsCount: number;
    archivedTudusCount: number;
    unlistedTudusCount: number;
  };
}

export interface TuduBackupSettingsData {
  showOutdatedTudus?: boolean;
  hasSeenOnboarding?: boolean;
  notificationSettings?: NotificationSettingsState;
  aiSettings?: {
    provider: AISettingsState['provider'];
    aiEmojiSuggestionsEnabled: boolean;
  };
  aiTokenUsage?: AITokenUsageState;
  securitySettings?: {
    isLockEnabled: boolean;
    pinHash: string | null;
    pinSalt: string | null;
    isBiometricsEnabled: boolean;
    lockTimeout: LockTimeoutOption;
  };
  backupPreferences?: {
    autoBackupEnabled: boolean;
    autoBackupFrequency: AutoBackupFrequency;
    reminderEnabled: boolean;
    reminderIntervalDays: number;
  };
}

export interface TuduBackupData {
  myLists: [string, List][];
  archivedLists: [string, List][];
  tudus: [string, [string, TuduItem][]][];
  archivedTudus: [string, [string, TuduItem][]][];
  unlistedTudus: [string, TuduItem][];
  counters: [string, Counter][];
  emojiUsage: [string, number][];
  settings?: TuduBackupSettingsData;
}

export interface TuduBackupPayload {
  metadata: TuduBackupMetadata;
  data: TuduBackupData;
}

export interface GoogleDriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
}

export interface BackupPreviewInfo {
  createdAt: Date;
  appVersion: string;
  version: number;
  listsCount: number;
  tudusCount: number;
  countersCount: number;
  archivedCount: number;
  source: 'google_drive' | 'local_file';
  hasSettings?: boolean;
  rawPayload: TuduBackupPayload;
}

