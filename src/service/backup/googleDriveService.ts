import { getGoogleAccessToken } from './googleAuthService';
import { GoogleDriveBackupFile } from './types';

const DRIVE_FILES_API = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';

export const listGoogleDriveBackups = async (): Promise<GoogleDriveBackupFile[]> => {
  const token = await getGoogleAccessToken();

  const url = `${DRIVE_FILES_API}?spaces=appDataFolder&fields=files(id,name,createdTime,modifiedTime,size)&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao listar backups do Google Drive: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const files: GoogleDriveBackupFile[] = data.files || [];
  return files.filter(f => f.name && f.name.startsWith('tudu-backup-'));
};

export const getLatestGoogleDriveBackup = async (): Promise<GoogleDriveBackupFile | null> => {
  const files = await listGoogleDriveBackups();
  if (files.length === 0) {
    return null;
  }
  return files[0];
};

export const downloadGoogleDriveBackupContent = async (
  fileId: string,
): Promise<string> => {
  const token = await getGoogleAccessToken();

  const url = `${DRIVE_FILES_API}/${fileId}?alt=media`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao baixar backup do Google Drive: ${response.status} - ${errorText}`);
  }

  return await response.text();
};

export const uploadGoogleDriveBackup = async (
  content: string,
  filename: string,
): Promise<GoogleDriveBackupFile> => {
  const token = await getGoogleAccessToken();

  const metadata = {
    name: filename,
    parents: ['appDataFolder'],
    mimeType: 'application/json',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    content +
    closeDelimiter;

  const url = `${DRIVE_UPLOAD_API}?uploadType=multipart`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      Accept: 'application/json',
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao enviar backup para o Google Drive: ${response.status} - ${errorText}`);
  }

  const result: GoogleDriveBackupFile = await response.json();

  // Prune older backups, keeping only the 5 most recent
  try {
    const allBackups = await listGoogleDriveBackups();
    if (allBackups.length > 5) {
      const toDelete = allBackups.slice(5);
      for (const oldFile of toDelete) {
        await deleteGoogleDriveBackup(oldFile.id);
      }
    }
  } catch (pruneErr) {
    console.warn('[GoogleDriveService] Failed to prune old backups:', pruneErr);
  }

  return result;
};

export const deleteGoogleDriveBackup = async (fileId: string): Promise<void> => {
  const token = await getGoogleAccessToken();

  const url = `${DRIVE_FILES_API}/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    console.warn(`[GoogleDriveService] Failed to delete file ${fileId}:`, response.status);
  }
};
