import {useCallback, useState} from 'react';
import {ParsedListItem, ParsedListResult} from '../types';
import {parseListFromTextWithAI} from '../ai-service';
import {useAISettings} from './useAISettings';
import {generateRandomHash} from '../../../hooks/useHashGenerator';

export const useAIParseList = () => {
  const {settings, getCurrentApiKey} = useAISettings();
  const [rawText, setRawText] = useState<string>('');
  const [parsedTitle, setParsedTitle] = useState<string>('📝 Lista');
  const [items, setItems] = useState<ParsedListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasParsed, setHasParsed] = useState<boolean>(false);

  const isAIConfigured = !!getCurrentApiKey();

  const parseText = useCallback(
    async (textToParse?: string): Promise<ParsedListResult | null> => {
      const text = (textToParse ?? rawText).trim();
      if (!text || text.length < 2) {
        setError('O texto está vazio.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await parseListFromTextWithAI(
          settings.provider,
          text,
          12000,
        );

        setParsedTitle(result.title || '📝 Lista');
        const parsedItems: ParsedListItem[] = result.items.map(label => ({
          id: generateRandomHash('parsed_item'),
          label,
          selected: true,
        }));

        setItems(parsedItems);
        setHasParsed(true);

        return result;
      } catch (err: any) {
        const errorMessage =
          err?.message === 'API Key not found'
            ? 'API Key not found'
            : err?.message || 'Falha ao processar texto com IA';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [rawText, settings.provider],
  );

  const toggleItem = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateItemLabel = useCallback((id: string, newLabel: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, label: newLabel} : item,
      ),
    );
  }, []);

  const toggleSelectAll = useCallback((selectAll?: boolean) => {
    setItems(prev => {
      const shouldSelect =
        typeof selectAll === 'boolean'
          ? selectAll
          : !prev.every(item => item.selected);
      return prev.map(item => ({...item, selected: shouldSelect}));
    });
  }, []);

  const reset = useCallback(() => {
    setRawText('');
    setParsedTitle('📝 Lista');
    setItems([]);
    setIsLoading(false);
    setError(null);
    setHasParsed(false);
  }, []);

  const selectedItems = items.filter(item => item.selected);
  const selectedCount = selectedItems.length;
  const selectedLabels = selectedItems.map(item => item.label);
  const isAllSelected = items.length > 0 && items.every(item => item.selected);

  return {
    rawText,
    setRawText,
    parsedTitle,
    setParsedTitle,
    items,
    setItems,
    isLoading,
    error,
    hasParsed,
    setHasParsed,
    isAIConfigured,
    parseText,
    toggleItem,
    removeItem,
    updateItemLabel,
    toggleSelectAll,
    reset,
    selectedItems,
    selectedCount,
    selectedLabels,
    isAllSelected,
  };
};
