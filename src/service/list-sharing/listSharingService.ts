import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import { ListViewModel, TuduViewModel } from '../../scenes/home/types';
import { withAppLockSuppressed } from '../security';
import {
  formatListAsText,
  generateTuduFilename,
  getImportListPreview,
  parseAndValidateTuduPayload,
  serializeListToTuduJson,
} from './listSharingSerializer';
import { ImportListPreviewInfo, TuduSharePayload } from './types';

export const exportAndShareListFile = async (
  list: ListViewModel,
  tudus: TuduViewModel[],
): Promise<void> => {
  const jsonContent = serializeListToTuduJson(list, tudus);
  const filename = generateTuduFilename(list.label);

  const fs = ReactNativeBlobUtil.fs;
  const cacheDir = fs.dirs.CacheDir;
  const filePath = `${cacheDir}/${filename}`;

  // 1. Write file to cache
  await fs.writeFile(filePath, jsonContent, 'utf8');

  // 2. Open native share sheet with app lock suppressed
  try {
    await withAppLockSuppressed(async () => {
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/octet-stream',
        filename: filename.replace('.tudu', ''),
        saveToFiles: true,
        title: `Compartilhar Lista: ${list.label}`,
        subject: `Lista Tudú - ${list.label}`,
      });
    });
  } catch (error: any) {
    if (
      error?.message &&
      !error.message.includes('User did not share') &&
      !error.message.includes('dismissed')
    ) {
      throw error;
    }
  }
};

export const shareListAsText = async (
  list: ListViewModel,
  tudus: TuduViewModel[],
): Promise<void> => {
  const formattedText = formatListAsText(list, tudus);

  try {
    await withAppLockSuppressed(async () => {
      await Share.open({
        message: formattedText,
        title: list.label,
        subject: list.label,
      });
    });
  } catch (error: any) {
    if (
      error?.message &&
      !error.message.includes('User did not share') &&
      !error.message.includes('dismissed')
    ) {
      throw error;
    }
  }
};

export const pickTuduFile = async (): Promise<ImportListPreviewInfo> => {
  try {
    const res = await withAppLockSuppressed(async () => {
      return await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles, '*/*'],
        copyTo: 'cachesDirectory',
      });
    });

    const fileUri = res.fileCopyUri || res.uri;
    let path = fileUri;
    if (path.startsWith('file://')) {
      path = path.replace('file://', '');
    }

    const content = await ReactNativeBlobUtil.fs.readFile(
      decodeURIComponent(path),
      'utf8',
    );

    const payload = parseAndValidateTuduPayload(content);
    return getImportListPreview(payload);
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      throw new Error('SELECTION_CANCELLED');
    }
    throw new Error(err.message || 'Erro ao ler o arquivo selecionado.');
  }
};

export const readTuduFileFromUri = async (
  uri: string,
): Promise<ImportListPreviewInfo> => {
  try {
    let content = '';

    if (uri.startsWith('content://')) {
      try {
        content = await ReactNativeBlobUtil.fs.readFile(uri, 'utf8');
      } catch (firstErr) {
        try {
          content = await ReactNativeBlobUtil.fs.readFile(
            decodeURIComponent(uri),
            'utf8',
          );
        } catch {
          // Fallback: copy content URI to a temporary cache file and read it
          const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/temp_incoming_${Date.now()}.tudu`;
          try {
            await ReactNativeBlobUtil.fs.cp(uri, tempPath);
            content = await ReactNativeBlobUtil.fs.readFile(tempPath, 'utf8');
            await ReactNativeBlobUtil.fs.unlink(tempPath).catch(() => {});
          } catch {
            throw firstErr;
          }
        }
      }
    } else {
      let path = uri;
      if (path.startsWith('file://')) {
        path = path.replace('file://', '');
      }

      try {
        content = await ReactNativeBlobUtil.fs.readFile(
          decodeURIComponent(path),
          'utf8',
        );
      } catch {
        content = await ReactNativeBlobUtil.fs.readFile(path, 'utf8');
      }
    }

    const payload = parseAndValidateTuduPayload(content);
    return getImportListPreview(payload);
  } catch (err: any) {
    throw new Error(err.message || 'Erro ao processar arquivo .tudu.');
  }
};
