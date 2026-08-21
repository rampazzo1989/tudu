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
  emojiUsageState,
  notificationSettingsState,
  showOutdatedTudus as showOutdatedTudusAtom,
} from '../../state/atoms';
import { notificationService } from '../notification';
import { TuduBackupPayload } from './types';
import { isToday } from '../../utils/date-utils';

export interface RestoreResult {
  success: boolean;
  listsRestored: number;
  tudusRestored: number;
  countersRestored: number;
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
  if (data.settings) {
    if (data.settings.showOutdatedTudus !== undefined) {
      setRecoil(showOutdatedTudusAtom, data.settings.showOutdatedTudus);
    }
    if (data.settings.notificationSettings) {
      setRecoil(notificationSettingsState, data.settings.notificationSettings);
    }
    if (data.settings.aiSettings) {
      setRecoil(aiSettingsState, prev => ({
        ...prev,
        provider: data.settings?.aiSettings?.provider || prev.provider,
        aiEmojiSuggestionsEnabled:
          data.settings?.aiSettings?.aiEmojiSuggestionsEnabled ??
          prev.aiEmojiSuggestionsEnabled,
      }));
    }
  }

  // 6. Rebuild TuduViewModels and re-sync Notification Engine
  const allTudusViewModels: TuduViewModel[] = [];
  const todayTudusViewModels: TuduViewModel[] = [];

  revivedTudus.forEach((tuduMap, listId) => {
    const listLabel = revivedMyLists.get(listId)?.label || '';
    tuduMap.forEach(item => {
      const vm = new TuduViewModel(item, listId, 'default', listLabel);
      allTudusViewModels.push(vm);
      if (item.dueDate && isToday(item.dueDate)) {
        todayTudusViewModels.push(vm);
      }
    });
  });

  revivedUnlistedTudus.forEach(item => {
    const vm = new TuduViewModel(item, 'unlisted', 'unlisted', '');
    allTudusViewModels.push(vm);
    if (item.dueDate && isToday(item.dueDate)) {
      todayTudusViewModels.push(vm);
    }
  });

  const notificationSettingsToUse =
    data.settings?.notificationSettings || {
      timedNotificationsEnabled: true,
      dailyDigestEnabled: true,
      dailyDigestHour: 8,
      dailyDigestMinute: 30,
    };

  try {
    await notificationService.syncAll(
      allTudusViewModels,
      todayTudusViewModels,
      notificationSettingsToUse,
    );
  } catch (err) {
    console.warn('[RestoreService] Failed to sync notifications after restore:', err);
  }

  return {
    success: true,
    listsRestored: revivedMyLists.size,
    tudusRestored: allTudusViewModels.length,
    countersRestored: revivedCounters.size,
  };
};
