import { Platform } from 'react-native';
import { Counter, List, TuduItem, TuduItemMap } from '../../scenes/home/types';
import {
  AISettingsState,
  AITokenUsageState,
  BackupSettingsState,
  NotificationSettingsState,
  SecuritySettingsState,
} from '../../state/atoms';
import {
  BackupPreviewInfo,
  TuduBackupData,
  TuduBackupMetadata,
  TuduBackupPayload,
  TuduBackupSettingsData,
} from './types';

export const CURRENT_BACKUP_VERSION = 1;
export const APP_NAME = 'Tudu';
export const APP_VERSION = '1.10.0';

export interface SerializeBackupParams {
  myLists: Map<string, List>;
  archivedLists: Map<string, List>;
  tudus: Map<string, TuduItemMap>;
  archivedTudus: Map<string, TuduItemMap>;
  unlistedTudus: TuduItemMap;
  counters: Map<string, Counter>;
  emojiUsage: Map<string, number>;
  includeSettings?: boolean;
  showOutdatedTudus?: boolean;
  hasSeenOnboarding?: boolean;
  notificationSettings?: NotificationSettingsState;
  aiSettings?: AISettingsState;
  aiTokenUsage?: AITokenUsageState;
  securitySettings?: SecuritySettingsState;
  backupSettings?: BackupSettingsState;
}

export const serializeBackupPayload = (
  params: SerializeBackupParams,
): TuduBackupPayload => {
  const {
    myLists,
    archivedLists,
    tudus,
    archivedTudus,
    unlistedTudus,
    counters,
    emojiUsage,
    includeSettings = true,
    showOutdatedTudus,
    hasSeenOnboarding,
    notificationSettings,
    aiSettings,
    aiTokenUsage,
    securitySettings,
    backupSettings,
  } = params;

  let totalTudus = unlistedTudus.size;
  tudus.forEach(listMap => {
    totalTudus += listMap.size;
  });

  let totalArchivedTudus = 0;
  archivedTudus.forEach(listMap => {
    totalArchivedTudus += listMap.size;
  });

  const metadata: TuduBackupMetadata = {
    version: CURRENT_BACKUP_VERSION,
    appName: APP_NAME,
    appVersion: APP_VERSION,
    createdAt: new Date().toISOString(),
    platform: Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'unknown',
    summary: {
      listsCount: myLists.size,
      tudusCount: totalTudus,
      countersCount: counters.size,
      archivedListsCount: archivedLists.size,
      archivedTudusCount: totalArchivedTudus,
      unlistedTudusCount: unlistedTudus.size,
    },
  };

  const serializedTudus: [string, [string, TuduItem][]][] = Array.from(
    tudus.entries(),
  ).map(([listId, tuduMap]) => [listId, Array.from(tuduMap.entries())]);

  const serializedArchivedTudus: [string, [string, TuduItem][]][] = Array.from(
    archivedTudus.entries(),
  ).map(([listId, tuduMap]) => [listId, Array.from(tuduMap.entries())]);

  let settingsData: TuduBackupSettingsData | undefined;

  if (includeSettings) {
    settingsData = {
      showOutdatedTudus,
      hasSeenOnboarding,
      notificationSettings,
      aiSettings: aiSettings
        ? {
            provider: aiSettings.provider,
            aiEmojiSuggestionsEnabled: aiSettings.aiEmojiSuggestionsEnabled,
          }
        : undefined,
      aiTokenUsage: aiTokenUsage
        ? {
            records: aiTokenUsage.records || [],
            lastResetAt: aiTokenUsage.lastResetAt || null,
          }
        : undefined,
      securitySettings: securitySettings
        ? {
            isLockEnabled: securitySettings.isLockEnabled,
            pinHash: securitySettings.pinHash,
            pinSalt: securitySettings.pinSalt,
            isBiometricsEnabled: securitySettings.isBiometricsEnabled,
            lockTimeout: securitySettings.lockTimeout,
          }
        : undefined,
      backupPreferences: backupSettings
        ? {
            autoBackupEnabled: backupSettings.autoBackupEnabled,
            autoBackupFrequency: backupSettings.autoBackupFrequency,
            reminderEnabled: backupSettings.reminderEnabled,
            reminderIntervalDays: backupSettings.reminderIntervalDays,
          }
        : undefined,
    };
  }

  const data: TuduBackupData = {
    myLists: Array.from(myLists.entries()),
    archivedLists: Array.from(archivedLists.entries()),
    tudus: serializedTudus,
    archivedTudus: serializedArchivedTudus,
    unlistedTudus: Array.from(unlistedTudus.entries()),
    counters: Array.from(counters.entries()),
    emojiUsage: Array.from(emojiUsage.entries()),
    settings: settingsData,
  };

  return {
    metadata,
    data,
  };
};

export const serializeBackupToJson = (
  params: SerializeBackupParams,
): string => {
  const payload = serializeBackupPayload(params);
  return JSON.stringify(payload, null, 2);
};

export const parseAndValidateBackupPayload = (
  rawJson: string,
): TuduBackupPayload => {
  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    throw new Error('Formato JSON inválido no arquivo de backup.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Arquivo de backup vazio ou inválido.');
  }

  if (!parsed.metadata || typeof parsed.metadata !== 'object') {
    throw new Error('Metadados do backup ausentes.');
  }

  if (typeof parsed.metadata.version !== 'number' || parsed.metadata.version > CURRENT_BACKUP_VERSION) {
    throw new Error(
      `Versão do backup incompatível (v${parsed.metadata?.version || '?'}). Atualize o aplicativo.`,
    );
  }

  if (!parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Dados do backup ausentes.');
  }

  const { data } = parsed;
  if (!Array.isArray(data.myLists) || !Array.isArray(data.tudus)) {
    throw new Error('Estrutura de listas ou tarefas corrompida no backup.');
  }

  return parsed as TuduBackupPayload;
};

export const generateBackupFilename = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `tudu-backup-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`;
};

export const getBackupPreview = (
  payload: TuduBackupPayload,
  source: 'google_drive' | 'local_file',
): BackupPreviewInfo => {
  const { metadata, data } = payload;
  const createdAt = metadata?.createdAt ? new Date(metadata.createdAt) : new Date();

  const listsCount = metadata?.summary?.listsCount ?? (data.myLists?.length || 0);
  const tudusCount = metadata?.summary?.tudusCount ?? (
    (data.tudus?.reduce((acc, [_, arr]) => acc + (Array.isArray(arr) ? arr.length : 0), 0) || 0) +
    (data.unlistedTudus?.length || 0)
  );
  const countersCount = metadata?.summary?.countersCount ?? (data.counters?.length || 0);
  const archivedCount =
    (metadata?.summary?.archivedListsCount ?? (data.archivedLists?.length || 0)) +
    (metadata?.summary?.archivedTudusCount ?? (
      data.archivedTudus?.reduce((acc, [_, arr]) => acc + (Array.isArray(arr) ? arr.length : 0), 0) || 0
    ));

  const hasSettings = Boolean(
    data.settings && Object.values(data.settings).some(v => v !== undefined),
  );

  return {
    createdAt,
    appVersion: metadata.appVersion || '1.0.0',
    version: metadata.version || 1,
    listsCount,
    tudusCount,
    countersCount,
    archivedCount,
    source,
    hasSettings,
    rawPayload: payload,
  };
};
