import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';

export const exportLocalBackupFile = async (
  jsonContent: string,
  filename: string,
): Promise<void> => {
  const fs = ReactNativeBlobUtil.fs;
  const cacheDir = fs.dirs.CacheDir;
  const filePath = `${cacheDir}/${filename}`;

  // 1. Write file to cache
  await fs.writeFile(filePath, jsonContent, 'utf8');

  // 2. Open native share sheet so user can save to Files / Downloads or send via email/chat
  try {
    await Share.open({
      url: `file://${filePath}`,
      type: 'application/json',
      filename: filename.replace('.json', ''),
      saveToFiles: true,
      title: 'Exportar Backup Tudu',
      subject: 'Backup Tudu',
    });
  } catch (error: any) {
    // User dismissing the share sheet is not an error
    if (error?.message && !error.message.includes('User did not share') && !error.message.includes('dismissed')) {
      throw error;
    }
  }
};

export const pickAndReadLocalBackupFile = async (): Promise<{
  content: string;
  filename: string;
}> => {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.allFiles, 'application/json', 'text/plain'],
      copyTo: 'cachesDirectory',
    });

    const fileUri = res.fileCopyUri || res.uri;
    const filename = res.name || 'backup.json';

    let path = fileUri;
    if (path.startsWith('file://')) {
      path = path.replace('file://', '');
    }

    const content = await ReactNativeBlobUtil.fs.readFile(
      decodeURIComponent(path),
      'utf8',
    );

    return { content, filename };
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      throw new Error('Seleção de arquivo cancelada.');
    }
    throw new Error(`Erro ao ler o arquivo selecionado: ${err.message || err}`);
  }
};
