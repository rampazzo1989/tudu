import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useImportListService } from '../../service/list-sharing';
import { suppressAppLock } from '../../service/security';
import { ImportListModal } from '../import-list-modal';

export const IncomingTuduFileHandler: React.FC = () => {
  const {
    previewData,
    isImporting,
    loadFromUri,
    confirmImport,
    cancelImport,
  } = useImportListService();

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;

      const lower = url.toLowerCase();
      if (
        lower.endsWith('.tudu') ||
        lower.includes('.tudu') ||
        url.startsWith('content://') ||
        url.startsWith('file://')
      ) {
        suppressAppLock(5000);
        // Delay slightly to ensure app/navigation is fully hydrated
        setTimeout(() => {
          loadFromUri(url);
        }, 500);
      }
    };

    // Check for cold start URL
    Linking.getInitialURL().then(handleUrl).catch(() => {});

    // Listen for incoming URLs while app is running
    const subscription = Linking.addEventListener('url', event => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [loadFromUri]);

  return (
    <ImportListModal
      visible={!!previewData}
      preview={previewData}
      onConfirmImport={confirmImport}
      onCancel={cancelImport}
      isLoading={isImporting}
    />
  );
};
