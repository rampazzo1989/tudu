import { Counter, List, TuduItem } from '../../scenes/home/types';
import { AISettingsState, NotificationSettingsState } from '../../state/atoms';

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

export interface TuduBackupData {
  myLists: [string, List][];
  archivedLists: [string, List][];
  tudus: [string, [string, TuduItem][]][];
  archivedTudus: [string, [string, TuduItem][]][];
  unlistedTudus: [string, TuduItem][];
  counters: [string, Counter][];
  emojiUsage: [string, number][];
  settings?: {
    showOutdatedTudus?: boolean;
    notificationSettings?: NotificationSettingsState;
    aiSettings?: {
      provider: AISettingsState['provider'];
      aiEmojiSuggestionsEnabled: boolean;
    };
  };
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
  rawPayload: TuduBackupPayload;
}
