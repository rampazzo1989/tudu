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

  /**
   * Performs an incremental bidirectional sync with the cloud database.
   */
  static async syncDelta(): Promise<boolean> {
    if (this.isSyncInProgress) return false;

    const session = getRecoil(userSessionState);
    const subscription = getRecoil(subscriptionState);
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
        listsDelta.push({
          id,
          name: list.name,
          color: list.color,
          icon: list.icon,
          order: list.order,
          isArchived: false,
          updatedAt: Date.now(),
        });
      });

      const tasksDelta: any[] = [];
      tudusMap.forEach((taskMap, listId) => {
        taskMap.forEach((task, id) => {
          tasksDelta.push({
            id,
            listId,
            title: task.title,
            description: task.description,
            done: task.done,
            starred: task.starred,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
            order: task.order,
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
    const session = getRecoil(userSessionState);
    if (!session?.token) return false;

    try {
      setRecoil(cloudSyncState, prev => ({ ...prev, isSyncing: true }));
      const backupPayload = await tuduApi.sync.exportBackup();
      await restoreStateFromPayload(backupPayload);
      setRecoil(cloudSyncState, prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: Date.now(),
      }));
      return true;
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
            next.set(l.id, {
              id: l.id,
              name: l.name,
              color: l.color,
              icon: l.icon,
              order: l.order,
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
            listMap.set(t.id, {
              id: t.id,
              title: t.title,
              description: t.description,
              done: t.done,
              starred: t.starred,
              dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
              order: t.order,
            });
          }
          next.set(listId, listMap);
        });
        return next;
      });
    }
  }
}
