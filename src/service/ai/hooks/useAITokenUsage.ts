import {useCallback, useMemo} from 'react';
import {useRecoilState} from 'recoil';
import {aiTokenUsageState, AITokenUsageRecord} from '../../../state/atoms';
import {AIProvider} from '../types';

export type UsagePeriod = 'week' | 'month' | 'total';

export interface ProviderUsageSummary {
  provider: AIProvider;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  requests: number;
}

export interface FeatureUsageSummary {
  feature: 'emoji' | 'task_suggestions' | 'test';
  totalTokens: number;
  requests: number;
}

export interface PeriodUsageStats {
  period: UsagePeriod;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalRequests: number;
  byProvider: Record<AIProvider, ProviderUsageSummary>;
  byFeature: Record<'emoji' | 'task_suggestions' | 'test', FeatureUsageSummary>;
  records: AITokenUsageRecord[];
}

const computeStats = (
  records: AITokenUsageRecord[],
  period: UsagePeriod,
): PeriodUsageStats => {
  const initialByProvider: Record<AIProvider, ProviderUsageSummary> = {
    gemini: {
      provider: 'gemini',
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requests: 0,
    },
    openai: {
      provider: 'openai',
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requests: 0,
    },
    claude: {
      provider: 'claude',
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
      requests: 0,
    },
  };

  const initialByFeature: Record<
    'emoji' | 'task_suggestions' | 'test',
    FeatureUsageSummary
  > = {
    emoji: {
      feature: 'emoji',
      totalTokens: 0,
      requests: 0,
    },
    task_suggestions: {
      feature: 'task_suggestions',
      totalTokens: 0,
      requests: 0,
    },
    test: {
      feature: 'test',
      totalTokens: 0,
      requests: 0,
    },
  };

  let totalTokens = 0;
  let promptTokens = 0;
  let completionTokens = 0;

  for (const r of records) {
    totalTokens += r.totalTokens;
    promptTokens += r.promptTokens;
    completionTokens += r.completionTokens;

    if (initialByProvider[r.provider]) {
      initialByProvider[r.provider].totalTokens += r.totalTokens;
      initialByProvider[r.provider].promptTokens += r.promptTokens;
      initialByProvider[r.provider].completionTokens += r.completionTokens;
      initialByProvider[r.provider].requests += 1;
    }

    if (initialByFeature[r.feature]) {
      initialByFeature[r.feature].totalTokens += r.totalTokens;
      initialByFeature[r.feature].requests += 1;
    }
  }

  return {
    period,
    totalTokens,
    promptTokens,
    completionTokens,
    totalRequests: records.length,
    byProvider: initialByProvider,
    byFeature: initialByFeature,
    records,
  };
};

export const useAITokenUsage = () => {
  const [usageState, setUsageState] = useRecoilState(aiTokenUsageState);

  const filterRecords = useCallback(
    (period: UsagePeriod): AITokenUsageRecord[] => {
      const records = usageState.records || [];
      if (period === 'total') {
        return records;
      }

      const now = new Date();
      if (period === 'month') {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return records.filter(r => {
          const d = new Date(r.timestamp);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
      }

      if (period === 'week') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        return records.filter(r => r.timestamp >= sevenDaysAgo);
      }

      return records;
    },
    [usageState.records],
  );

  const getStats = useCallback(
    (period: UsagePeriod): PeriodUsageStats => {
      const filtered = filterRecords(period);
      return computeStats(filtered, period);
    },
    [filterRecords],
  );

  const weeklyStats = useMemo(() => getStats('week'), [getStats]);
  const monthlyStats = useMemo(() => getStats('month'), [getStats]);
  const totalStats = useMemo(() => getStats('total'), [getStats]);

  const resetUsage = useCallback(() => {
    setUsageState({
      records: [],
      lastResetAt: new Date().toISOString(),
    });
  }, [setUsageState]);

  return {
    records: usageState.records || [],
    lastResetAt: usageState.lastResetAt,
    getStats,
    weeklyStats,
    monthlyStats,
    totalStats,
    resetUsage,
  };
};
