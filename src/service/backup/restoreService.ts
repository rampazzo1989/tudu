import { setRecoil } from 'recoil-nexus';
import {
  archivedLists as archivedListsAtom,
  archivedTudus as archivedTudusAtom,
  counters as countersAtom,
  myLists as myListsAtom,
  tudus as tudusAtom,
  unlistedTudus as unlistedTudusAtom,
} from '../../scenes/home/state';
import { Counter, List, TuduItem, TuduItemMap, TuduViewModel } from '../../scenes/home/types';
import {
  aiSettingsState,
  aiTokenUsageState,
  backupSettingsState,
  emojiUsageState,
  notificationSettingsState,
  securitySettingsState,
  showOutdatedTudus as showOutdatedTudusAtom,
} from '../../state/atoms';
import { hasSeenOnboarding as hasSeenOnboardingAtom } from '../../state/onboarding';
import { hasSecureApiKey } from '../ai/secure-storage';
import { notificationService } from '../notification';
import { TuduBackupPayload } from './types';
import { getDateOnlyTimeStamp } from '../../utils/date-utils';

export interface RestoreResult {
  success: boolean;
  listsRestored: number;
  tudusRestored: number;
  countersRestored: number;
  settingsRestored?: boolean;
}

export const restoreStateFromPayload = async (
  payload: TuduBackupPayload,
): Promise<RestoreResult> => {
  const { data } = payload;

  // 1. Revive Lists
  const revivedMyLists = new Map<string, List>(data.myLists || []);
  const revivedArchivedLists = new Map<string, List>(data.archivedLists || []);

  // 2. Revive Tudus with Date objects
  const reviveTuduMap = (items: [string, TuduItem][]): TuduItemMap => {
    return new Map<string, TuduItem>(
      items.map(([id, item]) => [
        id,
        {
          ...item,
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
        },
      ]),
    );
  };

  const revivedTudus = new Map<string, TuduItemMap>(
    (data.tudus || []).map(([listId, items]) => [
      listId,
      reviveTuduMap(items || []),
    ]),
  );

  const revivedArchivedTudus = new Map<string, TuduItemMap>(
    (data.archivedTudus || []).map(([listId, items]) => [
      listId,
      reviveTuduMap(items || []),
    ]),
  );

  const revivedUnlistedTudus = reviveTuduMap(data.unlistedTudus || []);

  // 3. Revive Counters & Emojis
  const revivedCounters = new Map<string, Counter>(data.counters || []);
  const revivedEmojiUsage = new Map<string, number>(data.emojiUsage || []);

  // 4. Update Recoil Atoms via RecoilNexus
  setRecoil(myListsAtom, revivedMyLists);
  setRecoil(archivedListsAtom, revivedArchivedLists);
  setRecoil(tudusAtom, revivedTudus);
  setRecoil(archivedTudusAtom, revivedArchivedTudus);
  setRecoil(unlistedTudusAtom, revivedUnlistedTudus);
  setRecoil(countersAtom, revivedCounters);
  setRecoil(emojiUsageState, revivedEmojiUsage);

  // 5. Restore Settings if present
  let hasRestoredSettings = false;

  if (data.settings) {
    hasRestoredSettings = true;

    if (data.settings.showOutdatedTudus !== undefined) {
      setRecoil(showOutdatedTudusAtom, data.settings.showOutdatedTudus);
    }

    if (data.settings.hasSeenOnboarding !== undefined) {
      setRecoil(hasSeenOnboardingAtom, data.settings.hasSeenOnboarding);
    }

    if (data.settings.notificationSettings) {
      setRecoil(notificationSettingsState, data.settings.notificationSettings);
    }

    if (data.settings.aiSettings) {
      const provider = data.settings.aiSettings.provider || 'gemini';
      const hasKey = hasSecureApiKey(provider);
      setRecoil(aiSettingsState, prev => ({
        ...prev,
        provider: data.settings?.aiSettings?.provider || prev.provider,
        aiEmojiSuggestionsEnabled:
          data.settings?.aiSettings?.aiEmojiSuggestionsEnabled ??
          prev.aiEmojiSuggestionsEnabled,
        hasApiKey: hasKey,
      }));
    }

    if (data.settings.aiTokenUsage) {
      setRecoil(aiTokenUsageState, {
        records: data.settings.aiTokenUsage.records || [],
        lastResetAt: data.settings.aiTokenUsage.lastResetAt || null,
      });
    }

    if (data.settings.securitySettings) {
      const sec = data.settings.securitySettings;
      setRecoil(securitySettingsState, prev => ({
        ...prev,
        isLockEnabled: sec.isLockEnabled ?? prev.isLockEnabled,
        pinHash: sec.pinHash ?? null,
        pinSalt: sec.pinSalt ?? null,
        isBiometricsEnabled: sec.isBiometricsEnabled ?? false,
        lockTimeout: sec.lockTimeout ?? 'immediate',
        failedAttempts: 0,
        lockoutUntil: null,
      }));
    }

    if (data.settings.backupPreferences) {
      const bp = data.settings.backupPreferences;
      setRecoil(backupSettingsState, prev => ({
        ...prev,
        autoBackupEnabled: bp.autoBackupEnabled ?? prev.autoBackupEnabled,
        autoBackupFrequency: bp.autoBackupFrequency ?? prev.autoBackupFrequency,
        reminderEnabled: bp.reminderEnabled ?? prev.reminderEnabled,
        reminderIntervalDays: bp.reminderIntervalDays ?? prev.reminderIntervalDays,
      }));
    }
  }

  // 6. Rebuild TuduViewModels and re-sync Notification Engine
  const notificationSettingsToUse =
    data.settings?.notificationSettings || {
      timedNotificationsEnabled: true,
      dailyDigestEnabled: true,
      dailyDigestHour: 8,
      dailyDigestMinute: 30,
    };

  const now = Date.now();
  const targetDigestDate = new Date();
  targetDigestDate.setHours(
    notificationSettingsToUse.dailyDigestHour,
    notificationSettingsToUse.dailyDigestMinute,
    0,
    0,
  );
  if (targetDigestDate.getTime() <= now) {
    targetDigestDate.setDate(targetDigestDate.getDate() + 1);
  }

  const targetDateTimestamp = getDateOnlyTimeStamp(targetDigestDate);

  const allTudusViewModels: TuduViewModel[] = [];
  const digestTudusViewModels: TuduViewModel[] = [];

  revivedTudus.forEach((tuduMap, listId) => {
    const listLabel = revivedMyLists.get(listId)?.label || '';
    tuduMap.forEach(item => {
      const vm = new TuduViewModel(item, listId, 'default', listLabel);
      allTudusViewModels.push(vm);
      if (item.dueDate && getDateOnlyTimeStamp(item.dueDate) === targetDateTimestamp) {
        digestTudusViewModels.push(vm);
      }
    });
  });

  revivedUnlistedTudus.forEach(item => {
    const vm = new TuduViewModel(item, 'unlisted', 'unlisted', '');
    allTudusViewModels.push(vm);
    if (item.dueDate && getDateOnlyTimeStamp(item.dueDate) === targetDateTimestamp) {
      digestTudusViewModels.push(vm);
    }
  });

  try {
    await notificationService.syncAll(
      allTudusViewModels,
      digestTudusViewModels,
      notificationSettingsToUse,
      targetDigestDate,
    );
  } catch (err) {
    console.warn('[RestoreService] Failed to sync notifications after restore:', err);
  }

  return {
    success: true,
    listsRestored: revivedMyLists.size,
    tudusRestored: allTudusViewModels.length,
    countersRestored: revivedCounters.size,
    settingsRestored: hasRestoredSettings,
  };
};
