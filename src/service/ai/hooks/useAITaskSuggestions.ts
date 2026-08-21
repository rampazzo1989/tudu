import {useCallback, useState} from 'react';
import {TaskSuggestionItem, TaskSuggestionRequest} from '../types';
import {suggestTasksWithAI} from '../ai-service';
import {useAISettings} from './useAISettings';
import {generateRandomHash} from '../../../hooks/useHashGenerator';

export const useAITaskSuggestions = () => {
  const {settings, getCurrentApiKey} = useAISettings();
  const [suggestions, setSuggestions] = useState<TaskSuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<TaskSuggestionRequest | null>(null);

  const isAIConfigured = !!getCurrentApiKey();

  const fetchSuggestions = useCallback(
    async (
      request: TaskSuggestionRequest,
      forceRefresh: boolean = false,
    ): Promise<TaskSuggestionItem[]> => {
      if (!request.listName || request.listName.trim().length === 0) {
        setSuggestions([]);
        return [];
      }

      setLastRequest(request);
      setIsLoading(true);
      setError(null);

      try {
        const rawItems = await suggestTasksWithAI(
          settings.provider,
          request,
          9000,
          forceRefresh,
        );

        const items: TaskSuggestionItem[] = rawItems.map(label => ({
          id: generateRandomHash('task_suggestion'),
          label,
          selected: true, // Selected by default for maximum convenience
        }));

        setSuggestions(items);
        return items;
      } catch (err: any) {
        const errorMessage =
          err?.message === 'API Key not found'
            ? 'API Key not found'
            : err?.message || 'Failed to suggest tasks';
        setError(errorMessage);
        setSuggestions([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [getCurrentApiKey, settings.provider],
  );

  const toggleItem = useCallback((id: string) => {
    setSuggestions(prev =>
      prev.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleSelectAll = useCallback((selectAll?: boolean) => {
    setSuggestions(prev => {
      const shouldSelect =
        typeof selectAll === 'boolean'
          ? selectAll
          : !prev.every(item => item.selected);
      return prev.map(item => ({...item, selected: shouldSelect}));
    });
  }, []);

  const regenerate = useCallback(
    async (additionalExcludeTasks?: string[]) => {
      if (!lastRequest) return [];
      const currentLabels = suggestions.map(s => s.label);
      const combinedExisting = [
        ...(lastRequest.existingTasks || []),
        ...currentLabels,
        ...(additionalExcludeTasks || []),
      ];

      return fetchSuggestions(
        {
          ...lastRequest,
          existingTasks: combinedExisting,
        },
        true,
      );
    },
    [fetchSuggestions, lastRequest, suggestions],
  );

  const reset = useCallback(() => {
    setSuggestions([]);
    setIsLoading(false);
    setError(null);
    setLastRequest(null);
  }, []);

  const selectedItems = suggestions.filter(item => item.selected);
  const selectedCount = selectedItems.length;
  const selectedLabels = selectedItems.map(item => item.label);
  const isAllSelected = suggestions.length > 0 && suggestions.every(item => item.selected);

  return {
    suggestions,
    isLoading,
    error,
    isAIConfigured,
    fetchSuggestions,
    toggleItem,
    removeItem,
    toggleSelectAll,
    regenerate,
    reset,
    selectedCount,
    selectedLabels,
    isAllSelected,
  };
};
