jest.mock('react-dom', () => ({}), { virtual: true });

const mockSetRecoil = jest.fn();
jest.mock('recoil-nexus', () => ({
  setRecoil: (atom: any, updater: any) => mockSetRecoil(atom, updater),
  getRecoil: jest.fn(),
}));

import {recordAITokenUsage} from '../src/service/ai/ai-service';
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
});
