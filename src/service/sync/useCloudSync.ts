import { useRecoilValue } from 'recoil';
import { useCallback } from 'react';
import { cloudSyncState, subscriptionState, userSessionState } from '../../state/atoms';
import { SyncEngine } from './sync-engine';

export function useCloudSync() {
  const syncState = useRecoilValue(cloudSyncState);
  const subscription = useRecoilValue(subscriptionState);
  const session = useRecoilValue(userSessionState);

  const syncNow = useCallback(async () => {
    return await SyncEngine.syncDelta();
  }, []);

  const uploadSnapshot = useCallback(async () => {
    return await SyncEngine.uploadInitialSnapshot();
  }, []);

  const restoreFromCloud = useCallback(async () => {
    return await SyncEngine.restoreFromCloud();
  }, []);

  return {
    isSyncing: syncState.isSyncing,
    lastSyncAt: syncState.lastSyncAt,
    lastError: syncState.lastError,
    isPro: subscription.isPro,
    isAuthenticated: !!session.token,
    syncNow,
    uploadSnapshot,
    restoreFromCloud,
  };
}
