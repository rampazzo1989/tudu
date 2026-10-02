jest.mock('react-dom', () => ({}), { virtual: true });

const mockGetRecoil = jest.fn();
const mockSetRecoil = jest.fn();

jest.mock('recoil-nexus', () => ({
  getRecoil: (atom: any) => mockGetRecoil(atom),
  setRecoil: (atom: any, val: any) => mockSetRecoil(atom, val),
}));

jest.mock('../src/service/backup/backupSerializer', () => ({
  serializeBackupPayload: jest.fn().mockReturnValue({
    version: 1,
    data: { lists: [], tasks: [] },
  }),
}));

jest.mock('../src/service/backup/restoreService', () => ({
  restoreStateFromPayload: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../src/service/api/tudu-api', () => ({
  tuduApi: {
    sync: {
      uploadSnapshot: jest.fn().mockResolvedValue({
        success: true,
        syncTimestamp: 1700000000,
        summary: {},
      }),
      syncDelta: jest.fn().mockResolvedValue({
        syncTimestamp: 1700000500,
        delta: {
          lists: [{ id: 'remote_1', name: 'Nova Lista Remota' }],
          tasks: [{ id: 'task_remote_1', listId: 'remote_1', title: 'Tarefa Remota' }],
        },
      }),
      exportBackup: jest.fn().mockResolvedValue({
        version: 1,
        timestamp: '2026-09-28',
        data: {
          myLists: [['list_1', { id: 'list_1', label: 'Lista 1' }]],
          tudus: [],
        },
      }),
    },
  },
}));

import { SyncEngine } from '../src/service/sync/sync-engine';
import { tuduApi } from '../src/service/api/tudu-api';
import {
  cloudSyncState,
  subscriptionState,
  userSessionState,
} from '../src/state/atoms';

describe('SyncEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadInitialSnapshot', () => {
    it('should skip upload if user is not pro or has no session token', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === userSessionState) return { token: null };
        if (atom === subscriptionState) return { isPro: false };
        return null;
      });

      const result = await SyncEngine.uploadInitialSnapshot();
      expect(result).toBe(false);
      expect(tuduApi.sync.uploadSnapshot).not.toHaveBeenCalled();
    });

    it('should successfully upload initial snapshot when user is pro', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === userSessionState) return { token: 'valid-jwt' };
        if (atom === subscriptionState) return { isPro: true };
        if (atom === cloudSyncState) return { isSyncing: false, lastSyncAt: null };
        return new Map();
      });

      const result = await SyncEngine.uploadInitialSnapshot();
      expect(result).toBe(true);
      expect(tuduApi.sync.uploadSnapshot).toHaveBeenCalled();
      expect(mockSetRecoil).toHaveBeenCalledWith(
        cloudSyncState,
        expect.objectContaining({
          isSyncing: false,
          lastSyncAt: 1700000000,
          pendingMutationsCount: 0,
        }),
      );
    });
  });

  describe('syncDelta', () => {
    it('should skip syncDelta if user is not pro', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === userSessionState) return { token: 'jwt' };
        if (atom === subscriptionState) return { isPro: false };
        if (atom === cloudSyncState) return { isSyncing: false };
        return new Map();
      });

      const result = await SyncEngine.syncDelta();
      expect(result).toBe(false);
      expect(tuduApi.sync.syncDelta).not.toHaveBeenCalled();
    });

    it('should perform bidirectional delta sync for pro user and apply remote delta', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === userSessionState) return { token: 'jwt' };
        if (atom === subscriptionState) return { isPro: true };
        if (atom === cloudSyncState) return { isSyncing: false, lastSyncAt: 1000 };
        return new Map();
      });

      const result = await SyncEngine.syncDelta();
      expect(result).toBe(true);
      expect(tuduApi.sync.syncDelta).toHaveBeenCalledWith(
        expect.objectContaining({
          lastSyncTimestamp: 1000,
        }),
      );
    });
  });

  describe('restoreFromCloud', () => {
    it('should fetch export and restore state into Recoil storage', async () => {
      mockGetRecoil.mockImplementation((atom: any) => {
        if (atom === userSessionState) return { token: 'jwt' };
        return null;
      });

      const result = await SyncEngine.restoreFromCloud();
      expect(result).toBe(true);
      expect(tuduApi.sync.exportBackup).toHaveBeenCalled();
    });
  });
});
