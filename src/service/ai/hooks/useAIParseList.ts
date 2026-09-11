import {useCallback, useState} from 'react';
import {AIOrderingType, ParsedListItem, ParsedListResult, ParsedSectionGroup} from '../types';
import {parseListFromTextWithAI} from '../ai-service';
import {useAISettings} from './useAISettings';
import {generateRandomHash} from '../../../hooks/useHashGenerator';

export const useAIParseList = () => {
  const {settings, getCurrentApiKey} = useAISettings();
  const [rawText, setRawText] = useState<string>('');
  const [parsedTitle, setParsedTitle] = useState<string>('📝 Lista');
  const [items, setItems] = useState<ParsedListItem[]>([]);
  const [sections, setSections] = useState<ParsedSectionGroup[]>([]);
  const [orderingType, setOrderingType] = useState<AIOrderingType>('smart');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasParsed, setHasParsed] = useState<boolean>(false);

  const isAIConfigured = !!getCurrentApiKey();

  const parseText = useCallback(
    async (
      textToParse?: string,
      chosenOrderingType?: AIOrderingType,
      customOrderingPrompt?: string,
    ): Promise<ParsedListResult | null> => {
      const text = (textToParse ?? rawText).trim();
      if (!text || text.length < 2) {
        setError('O texto está vazio.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      const effectiveOrdering = chosenOrderingType ?? orderingType;
      const effectivePrompt = customOrderingPrompt ?? customPrompt;

      try {
        const result = await parseListFromTextWithAI(
          settings.provider,
          text,
          effectiveOrdering,
          effectivePrompt,
          45000,
        );

        setParsedTitle(result.title || '📝 Lista');

        const allParsedItems: ParsedListItem[] = [];
        const structuredSections: ParsedSectionGroup[] = [];

        if (result.sections && result.sections.length > 0) {
          result.sections.forEach(sec => {
            const sectionItems: ParsedListItem[] = sec.items.map(label => ({
              id: generateRandomHash('parsed_item'),
              label,
              selected: true,
              sectionTitle: sec.title,
            }));
            allParsedItems.push(...sectionItems);
            structuredSections.push({
              title: sec.title,
              items: sectionItems,
            });
          });
        } else {
          result.items.forEach(label => {
            allParsedItems.push({
              id: generateRandomHash('parsed_item'),
              label,
              selected: true,
            });
          });
        }

        setItems(allParsedItems);
        setSections(structuredSections);
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
    [rawText, orderingType, customPrompt, settings.provider],
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
    setSections(prev =>
      prev
        .map(sec => ({
          ...sec,
          items: sec.items.filter(item => item.id !== id),
        }))
        .filter(sec => sec.items.length > 0),
    );
  }, []);

  const updateItemLabel = useCallback((id: string, newLabel: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, label: newLabel} : item,
      ),
    );
    setSections(prev =>
      prev.map(sec => ({
        ...sec,
        items: sec.items.map(item =>
          item.id === id ? {...item, label: newLabel} : item,
        ),
      })),
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
    setSections([]);
    setOrderingType('smart');
    setCustomPrompt('');
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
    sections,
    setSections,
    orderingType,
    setOrderingType,
    customPrompt,
    setCustomPrompt,
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
