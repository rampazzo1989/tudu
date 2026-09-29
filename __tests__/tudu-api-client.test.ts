jest.mock('react-dom', () => ({}), { virtual: true });

const mockGetRecoil = jest.fn();
const mockSetRecoil = jest.fn();

jest.mock('recoil-nexus', () => ({
  getRecoil: (atom: any) => mockGetRecoil(atom),
  setRecoil: (atom: any, val: any) => mockSetRecoil(atom, val),
}));

import { apiRequest, ApiError, API_BASE_URL } from '../src/service/api/client';
import { tuduApi } from '../src/service/api/tudu-api';
import { paywallModalVisibleState, userSessionState } from '../src/state/atoms';

describe('ApiClient & Tudú API Service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetRecoil.mockReturnValue(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('apiRequest and ApiError', () => {
    it('should make successful GET request with authorization header when session has token', async () => {
      mockGetRecoil.mockReturnValue({ token: 'jwt-session-token' });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: 'ok', data: [1, 2, 3] }),
      } as any);

      const result = await apiRequest('api/v1/users/me', 'GET');

      expect(result).toEqual({ status: 'ok', data: [1, 2, 3] });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/users/me'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-session-token',
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should make successful POST request with body', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as any);

      const result = await apiRequest('api/v1/ai/suggest-emojis', 'POST', {
        title: 'Mercado',
      });

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/ai/suggest-emojis'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Mercado' }),
        }),
      );
    });

    it('should throw ApiError and clear session on 401 Unauthorized', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Sessão expirada. Faça login novamente.' }),
      } as any);

      await expect(apiRequest('api/v1/sync/snapshot', 'GET')).rejects.toThrow(ApiError);
      expect(mockSetRecoil).toHaveBeenCalledWith(userSessionState, expect.any(Function));
    });

    it('should trigger paywall modal on 403 Forbidden with SUBSCRIPTION_REQUIRED', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({
          message: 'Assinatura Tudú Pro necessária.',
          code: 'SUBSCRIPTION_REQUIRED',
        }),
      } as any);

      await expect(apiRequest('api/v1/ai/suggest-emojis', 'POST', {})).rejects.toThrow(ApiError);
      expect(mockSetRecoil).toHaveBeenCalledWith(paywallModalVisibleState, true);
    });
  });

  describe('tuduApi Endpoints', () => {
    it('should call auth.loginWithGoogle', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          accessToken: 'jwt-123',
          user: { id: 'u1', email: 'user@example.com' },
        }),
      } as any);

      const res = await tuduApi.auth.loginWithGoogle('google-token-xyz');
      expect(res.accessToken).toBe('jwt-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/google'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ idToken: 'google-token-xyz' }),
        }),
      );
    });

    it('should call ai.suggestEmojis', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ emojis: ['🛒', '🍎'], providerUsed: 'deepseek' }),
      } as any);

      const res = await tuduApi.ai.suggestEmojis({ type: 'list', title: 'Compras' });
      expect(res.emojis).toEqual(['🛒', '🍎']);
      expect(res.providerUsed).toBe('deepseek');
    });

    it('should call ai.suggestTasks', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          suggestions: ['Comprar pão', 'Comprar leite'],
          providerUsed: 'openai',
        }),
      } as any);

      const res = await tuduApi.ai.suggestTasks({ listName: 'Padaria' });
      expect(res.suggestions).toHaveLength(2);
      expect(res.providerUsed).toBe('openai');
    });

    it('should call ai.parseList', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          result: {
            listTitle: 'Viagem',
            listEmoji: '✈️',
            items: [{ text: 'Passaporte', emoji: '🛂' }],
          },
          providerUsed: 'deepseek',
        }),
      } as any);

      const res = await tuduApi.ai.parseList({ rawText: 'Viagem: Passaporte' });
      expect(res.result.listTitle).toBe('Viagem');
      expect(res.result.items[0].text).toBe('Passaporte');
    });

    it('should call sync.uploadSnapshot', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, syncTimestamp: 12345, summary: {} }),
      } as any);

      const res = await tuduApi.sync.uploadSnapshot({
        lists: [],
        tasks: [],
      });

      expect(res.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/sync/snapshot'),
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should call sync.syncDelta', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          syncTimestamp: 123456,
          delta: { lists: [], tasks: [], counters: [], settings: null },
        }),
      } as any);

      const res = await tuduApi.sync.syncDelta({
        lastSyncTimestamp: 1000,
        lists: [{ id: '1', title: 'Test' }],
      });

      expect(res.syncTimestamp).toBe(123456);
    });

    it('should call sync.exportBackup', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          snapshot: { lists: [], tudus: [], version: 1 },
        }),
      } as any);

      const res = await tuduApi.sync.exportBackup();
      expect(res.snapshot).toBeDefined();
    });
  });
});
