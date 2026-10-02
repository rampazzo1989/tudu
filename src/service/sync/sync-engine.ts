import { getRecoil, setRecoil } from 'recoil-nexus';
import {
  archivedLists as archivedListsAtom,
  archivedTudus as archivedTudusAtom,
  counters as countersAtom,
  myLists as myListsAtom,
  tudus as tudusAtom,
  unlistedTudus as unlistedTudusAtom,
} from '../../scenes/home/state';
import {
  aiSettingsState,
  aiTokenUsageState,
  backupSettingsState,
  cloudSyncState,
  emojiUsageState,
  notificationSettingsState,
  securitySettingsState,
  showOutdatedTudus as showOutdatedTudusAtom,
  subscriptionState,
  userSessionState,
} from '../../state/atoms';
import { hasSeenOnboarding as hasSeenOnboardingAtom } from '../../state/onboarding';
import { serializeBackupPayload } from '../backup/backupSerializer';
import { restoreStateFromPayload } from '../backup/restoreService';
import { tuduApi } from '../api/tudu-api';
import { List, TuduItem, TuduItemMap } from '../../scenes/home/types';

export class SyncEngine {
  private static isSyncInProgress = false;

  /**
   * Uploads initial complete snapshot of all local data to the cloud database.
   * Typically triggered automatically after purchasing/activating Tudú Pro.
   */
  static async uploadInitialSnapshot(): Promise<boolean> {
    const session = getRecoil(userSessionState);
    const subscription = getRecoil(subscriptionState);

    if (!session?.token || !subscription.isPro) {
      console.log('[SyncEngine] Skipping snapshot upload: user is not an active subscriber.');
      return false;
    }

    try {
      setRecoil(cloudSyncState, prev => ({ ...prev, isSyncing: true, lastError: null }));

      const payload = serializeBackupPayload({
        myLists: getRecoil(myListsAtom),
        archivedLists: getRecoil(archivedListsAtom),
        tudus: getRecoil(tudusAtom),
        archivedTudus: getRecoil(archivedTudusAtom),
        unlistedTudus: getRecoil(unlistedTudusAtom),
        counters: getRecoil(countersAtom),
        emojiUsage: getRecoil(emojiUsageState),
        showOutdatedTudus: getRecoil(showOutdatedTudusAtom),
        hasSeenOnboarding: getRecoil(hasSeenOnboardingAtom),
        notificationSettings: getRecoil(notificationSettingsState),
        aiSettings: getRecoil(aiSettingsState),
        aiTokenUsage: getRecoil(aiTokenUsageState),
        securitySettings: getRecoil(securitySettingsState),
        backupSettings: getRecoil(backupSettingsState),
      });

      const result = await tuduApi.sync.uploadSnapshot(payload.data);

      setRecoil(cloudSyncState, {
        isSyncing: false,
        lastSyncAt: result.syncTimestamp,
        pendingMutationsCount: 0,
        lastError: null,
      });

      console.log('[SyncEngine] Initial cloud snapshot uploaded successfully.');
      return true;
    } catch (error: any) {
      console.error('[SyncEngine] Error uploading initial snapshot:', error);
      setRecoil(cloudSyncState, prev => ({
        ...prev,
        isSyncing: false,
        lastError: error?.message || 'Falha ao sincronizar com a nuvem.',
      }));
      return false;
    }
  }

  private static syncDebounceTimer: any = null;

  /**
   * Schedules a debounced delta sync (default 1200ms after user mutation).
   */
  static scheduleSync(delayMs: number = 1200) {
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }
    this.syncDebounceTimer = setTimeout(() => {
      this.syncDebounceTimer = null;
      this.syncDelta().catch(err => {
        console.warn('[SyncEngine] Scheduled sync error:', err);
      });
    }, delayMs);
  }

  /**
   * Performs an incremental bidirectional sync with the cloud database.
   */
  static async syncDelta(): Promise<boolean> {
    if (this.isSyncInProgress) return false;

    let session = getRecoil(userSessionState);
    if (!session?.token && __DEV__) {
      try {
        const { AuthService } = require('../auth/auth-service');
        await AuthService.devLogin();
        session = getRecoil(userSessionState);
      } catch (e) {
        // Fallback
      }
    }

    let subscription = getRecoil(subscriptionState);
    if (!subscription.isPro && session?.token) {
      try {
        const { AuthService } = require('../auth/auth-service');
        await AuthService.refreshSubscriptionStatus();
        subscription = getRecoil(subscriptionState);
      } catch (e) {
        // Fallback
      }
    }

    const syncState = getRecoil(cloudSyncState);

    if (!session?.token || !subscription.isPro) {
      return false;
    }

    this.isSyncInProgress = true;
    setRecoil(cloudSyncState, prev => ({ ...prev, isSyncing: true, lastError: null }));

    try {
      const lastSyncTimestamp = syncState.lastSyncAt || 0;

      // Extract current local lists and tasks to delta
      const myListsMap = getRecoil(myListsAtom);
      const tudusMap = getRecoil(tudusAtom);

      const listsDelta: any[] = [];
      myListsMap.forEach((list, id) => {
        const listName = list.label || (list as any).name || 'Lista';
        listsDelta.push({
          id,
          name: listName,
          label: listName,
          color: list.color || null,
          icon: (list as any).icon || null,
          order: (list as any).order ?? 0,
          isArchived: false,
          updatedAt: Date.now(),
        });
      });

      const tasksDelta: any[] = [];
      tudusMap.forEach((taskMap, listId) => {
        taskMap.forEach((task, id) => {
          const taskTitle = task.label || (task as any).title || 'Tarefa';
          tasksDelta.push({
            id,
            listId,
            title: taskTitle,
            label: taskTitle,
            description: (task as any).description || null,
            done: !!task.done,
            starred: !!task.starred,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
            order: (task as any).scheduledOrder ?? (task as any).order ?? 0,
            isArchived: false,
            updatedAt: Date.now(),
          });
        });
      });

      const response = await tuduApi.sync.syncDelta({
        lastSyncTimestamp,
        lists: listsDelta,
        tasks: tasksDelta,
      });

      // Apply incoming remote changes to local Recoil state
      if (response?.delta) {
        this.applyRemoteDelta(response.delta);
      }

      setRecoil(cloudSyncState, {
        isSyncing: false,
        lastSyncAt: response.syncTimestamp,
        pendingMutationsCount: 0,
        lastError: null,
      });

      return true;
    } catch (error: any) {
      console.warn('[SyncEngine] Delta sync error:', error);
      setRecoil(cloudSyncState, prev => ({
        ...prev,
        isSyncing: false,
        lastError: error?.message || 'Erro na sincronização.',
      }));
      return false;
    } finally {
      this.isSyncInProgress = false;
    }
  }

  /**
   * Restores complete cloud backup into local storage.
   */
  static async restoreFromCloud(): Promise<boolean> {
    let session = getRecoil(userSessionState);
    if (!session?.token && __DEV__) {
      try {
        const { AuthService } = require('../auth/auth-service');
        await AuthService.devLogin();
        session = getRecoil(userSessionState);
      } catch (e) {
        // Fallback
      }
    }
    if (!session?.token) return false;

    try {
      setRecoil(cloudSyncState, prev => ({ ...prev, isSyncing: true }));
      const backupPayload = await tuduApi.sync.exportBackup();
      const hasCloudData =
        (backupPayload?.data?.myLists && backupPayload.data.myLists.length > 0) ||
        (backupPayload?.data?.tudus && backupPayload.data.tudus.length > 0) ||
        (backupPayload?.data?.counters && backupPayload.data.counters.length > 0);

      if (hasCloudData) {
        await restoreStateFromPayload(backupPayload);
        setRecoil(cloudSyncState, prev => ({
          ...prev,
          isSyncing: false,
          lastSyncAt: Date.now(),
        }));
        console.log('[SyncEngine] Restored state from cloud backup successfully.');
        return true;
      } else {
        console.log('[SyncEngine] Cloud backup is empty, uploading initial snapshot...');
        await this.uploadInitialSnapshot();
        return true;
      }
    } catch (error) {
      console.error('[SyncEngine] Error restoring from cloud:', error);
      setRecoil(cloudSyncState, prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  }

  /**
   * Applies remote delta changes from server to local Recoil state.
   */
  private static applyRemoteDelta(delta: { lists?: any[]; tasks?: any[] }) {
    if (delta.lists && delta.lists.length > 0) {
      setRecoil(myListsAtom, prev => {
        const next = new Map(prev);
        delta.lists?.forEach(l => {
          if (l.deletedAt) {
            next.delete(l.id);
          } else {
            const existing = next.get(l.id);
            next.set(l.id, {
              ...existing,
              id: l.id,
              label: l.name || l.label || existing?.label || 'Lista',
              color: l.color || existing?.color,
            });
          }
        });
        return next;
      });
    }

    if (delta.tasks && delta.tasks.length > 0) {
      setRecoil(tudusAtom, prev => {
        const next = new Map(prev);
        delta.tasks?.forEach(t => {
          const listId = t.listId || 'unlisted';
          const listMap: TuduItemMap = new Map(next.get(listId) || []);

          if (t.deletedAt) {
            listMap.delete(t.id);
          } else {
            const existing = listMap.get(t.id);
            listMap.set(t.id, {
              ...existing,
              id: t.id,
              label: t.title || t.label || existing?.label || 'Tarefa',
              done: Boolean(t.done),
              starred: Boolean(t.starred),
              dueDate: t.dueDate ? new Date(t.dueDate) : existing?.dueDate,
              scheduledOrder: typeof t.order === 'number' ? t.order : existing?.scheduledOrder,
            });
          }
          next.set(listId, listMap);
        });
        return next;
      });
    }
  }
}
