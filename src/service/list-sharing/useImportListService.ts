import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { generateRandomHash } from '../../hooks/useHashGenerator';
import { navigationRef } from '../../navigation/navigation-ref';
import { ListViewModel, TuduViewModel } from '../../scenes/home/types';
import { useListService } from '../list-service-hook/useListService';
import { pickTuduFile, readTuduFileFromUri } from './listSharingService';
import { ImportListPreviewInfo, TuduSharePayload } from './types';

export const useImportListService = () => {
  const { t } = useTranslation();
  const { saveListAndTudus } = useListService();
  const [previewData, setPreviewData] = useState<ImportListPreviewInfo | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const importPayload = useCallback(
    async (payload: TuduSharePayload): Promise<{ listId: string; title: string }> => {
      setIsImporting(true);
      try {
        const newListId = generateRandomHash('List');
        const newList = new ListViewModel(
          {
            id: newListId,
            label: payload.list.label,
            color: payload.list.color,
            groupName: payload.list.groupName,
          },
          undefined,
          'default',
        );

        const newTudus = (payload.tudus || []).map(item => {
          return new TuduViewModel(
            {
              id: generateRandomHash('Tudu'),
              label: item.label,
              done: item.done,
              dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
              hasTime: item.hasTime,
              starred: item.starred,
              recurrence: item.recurrence,
            },
            newListId,
            'default',
          );
        });

        newList.tudus = newTudus;
        saveListAndTudus(newList);

        Toast.show({
          type: 'success',
          text1: t('importModal.successTitle', { defaultValue: 'Lista importada!' }),
          text2: t('importModal.successMsg', {
            defaultValue: 'A lista foi importada com sucesso.',
          }),
        });

        return { listId: newListId, title: newList.label };
      } finally {
        setIsImporting(false);
      }
    },
    [saveListAndTudus, t],
  );

  const pickAndPreviewTuduFile = useCallback(async () => {
    try {
      const preview = await pickTuduFile();
      setPreviewData(preview);
    } catch (err: any) {
      if (err.message === 'SELECTION_CANCELLED') {
        return;
      }
      Toast.show({
        type: 'error',
        text1: t('importModal.errorTitle', { defaultValue: 'Erro ao abrir arquivo' }),
        text2: err.message || t('importModal.errorMsg', { defaultValue: 'Não foi possível ler o arquivo selecionado.' }),
      });
    }
  }, [t]);

  const loadFromUri = useCallback(
    async (uri: string) => {
      try {
        const preview = await readTuduFileFromUri(uri);
        setPreviewData(preview);
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: t('importModal.errorTitle', { defaultValue: 'Erro ao abrir arquivo' }),
          text2: err.message || t('importModal.errorMsg', { defaultValue: 'Não foi possível processar o arquivo .tudu.' }),
        });
      }
    },
    [t],
  );

  const confirmImport = useCallback(async () => {
    if (!previewData) return;
    try {
      const { listId, title } = await importPayload(previewData.rawPayload);
      setPreviewData(null);

      // Navigate to the newly imported list
      if (navigationRef.isReady()) {
        navigationRef.navigate('List', {
          listId,
          title,
          listOrigin: 'default',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('importModal.errorTitle', { defaultValue: 'Erro ao importar' }),
        text2: err.message || t('importModal.importErrorMsg', { defaultValue: 'Falha ao salvar a lista importada.' }),
      });
    }
  }, [importPayload, previewData]);

  const cancelImport = useCallback(() => {
    setPreviewData(null);
  }, []);

  return {
    previewData,
    setPreviewData,
    isImporting,
    pickAndPreviewTuduFile,
    loadFromUri,
    confirmImport,
    cancelImport,
  };
};
