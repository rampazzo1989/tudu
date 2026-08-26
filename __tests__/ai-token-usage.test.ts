jest.mock('react-dom', () => ({}), { virtual: true });

const mockSetRecoil = jest.fn();
jest.mock('recoil-nexus', () => ({
  setRecoil: (atom: any, updater: any) => mockSetRecoil(atom, updater),
  getRecoil: jest.fn(),
}));

import {recordAITokenUsage} from '../src/service/ai/ai-service';
import {computeStats} from '../src/service/ai/hooks/useAITokenUsage';
import {aiTokenUsageState} from '../src/state/atoms';

describe('AI Token Usage Service & Aggregation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('recordAITokenUsage', () => {
    it('should not record anything if usage is missing or 0', () => {
      recordAITokenUsage('gemini', 'emoji', undefined);
      recordAITokenUsage('openai', 'task_suggestions', {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      });
      expect(mockSetRecoil).not.toHaveBeenCalled();
    });

    it('should record valid usage via setRecoil', () => {
      recordAITokenUsage('gemini', 'emoji', {
        promptTokens: 100,
        completionTokens: 25,
        totalTokens: 125,
      });

      expect(mockSetRecoil).toHaveBeenCalledTimes(1);
      expect(mockSetRecoil).toHaveBeenCalledWith(
        aiTokenUsageState,
        expect.any(Function),
      );

      // Execute updater passed to setRecoil
      const updater = mockSetRecoil.mock.calls[0][1];
      const prevState = {records: [], lastResetAt: null};
      const nextState = updater(prevState);

      expect(nextState.records.length).toBe(1);
      expect(nextState.records[0]).toMatchObject({
        provider: 'gemini',
        feature: 'emoji',
        promptTokens: 100,
        completionTokens: 25,
        totalTokens: 125,
      });
      expect(typeof nextState.records[0].timestamp).toBe('number');
    });

    it('should record parse_list feature usage', () => {
      recordAITokenUsage('claude', 'parse_list', {
        promptTokens: 300,
        completionTokens: 120,
        totalTokens: 420,
      });

      expect(mockSetRecoil).toHaveBeenCalledTimes(1);
      const updater = mockSetRecoil.mock.calls[0][1];
      const prevState = {records: [], lastResetAt: null};
      const nextState = updater(prevState);

      expect(nextState.records.length).toBe(1);
      expect(nextState.records[0]).toMatchObject({
        provider: 'claude',
        feature: 'parse_list',
        promptTokens: 300,
        completionTokens: 120,
        totalTokens: 420,
      });
    });

    it('should limit stored records to at most 1000', () => {
      recordAITokenUsage('openai', 'task_suggestions', {
        promptTokens: 200,
        completionTokens: 50,
        totalTokens: 250,
      });

      const updater = mockSetRecoil.mock.calls[0][1];
      const existingRecords = Array.from({length: 1050}, (_, i) => ({
        id: `id_${i}`,
        timestamp: Date.now(),
        provider: 'openai' as const,
        feature: 'task_suggestions' as const,
        promptTokens: 10,
        completionTokens: 10,
        totalTokens: 20,
      }));

      const nextState = updater({records: existingRecords, lastResetAt: null});
      expect(nextState.records.length).toBe(1000);
    });
  });

  describe('computeStats', () => {
    it('should correctly aggregate usage across all features including parse_list', () => {
      const mockRecords = [
        {
          id: '1',
          timestamp: Date.now(),
          provider: 'gemini' as const,
          feature: 'emoji' as const,
          promptTokens: 100,
          completionTokens: 20,
          totalTokens: 120,
        },
        {
          id: '2',
          timestamp: Date.now(),
          provider: 'openai' as const,
          feature: 'task_suggestions' as const,
          promptTokens: 200,
          completionTokens: 50,
          totalTokens: 250,
        },
        {
          id: '3',
          timestamp: Date.now(),
          provider: 'claude' as const,
          feature: 'parse_list' as const,
          promptTokens: 400,
          completionTokens: 150,
          totalTokens: 550,
        },
        {
          id: '4',
          timestamp: Date.now(),
          provider: 'gemini' as const,
          feature: 'parse_list' as const,
          promptTokens: 300,
          completionTokens: 100,
          totalTokens: 400,
        },
      ];

      const stats = computeStats(mockRecords, 'total');

      expect(stats.totalTokens).toBe(1320);
      expect(stats.promptTokens).toBe(1000);
      expect(stats.completionTokens).toBe(320);
      expect(stats.totalRequests).toBe(4);

      // Feature breakdown
      expect(stats.byFeature.parse_list).toEqual({
        feature: 'parse_list',
        totalTokens: 950,
        requests: 2,
      });
      expect(stats.byFeature.task_suggestions).toEqual({
        feature: 'task_suggestions',
        totalTokens: 250,
        requests: 1,
      });
      expect(stats.byFeature.emoji).toEqual({
        feature: 'emoji',
        totalTokens: 120,
        requests: 1,
      });
      expect(stats.byFeature.test).toEqual({
        feature: 'test',
        totalTokens: 0,
        requests: 0,
      });

      // Provider breakdown
      expect(stats.byProvider.gemini.totalTokens).toBe(520);
      expect(stats.byProvider.openai.totalTokens).toBe(250);
      expect(stats.byProvider.claude.totalTokens).toBe(550);
    });
  });
});
