import { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  archivedLists as archivedListsAtom,
  archivedTudus as archivedTudusAtom,
  counters as countersAtom,
  myLists as myListsAtom,
  tudus as tudusAtom,
  unlistedTudus as unlistedTudusAtom,
} from '../../scenes/home/state';
import {
  aiSettingsState,
  AutoBackupFrequency,
  backupSettingsState,
  emojiUsageState,
  notificationSettingsState,
  showOutdatedTudus as showOutdatedTudusAtom,
} from '../../state/atoms';
import {
  generateBackupFilename,
  getBackupPreview,
  parseAndValidateBackupPayload,
  serializeBackupToJson,
} from './backupSerializer';
import {
  signInSilentlyWithGoogle,
  signInWithGoogle,
  signOutFromGoogle,
} from './googleAuthService';
import {
  downloadGoogleDriveBackupContent,
  getLatestGoogleDriveBackup,
  uploadGoogleDriveBackup,
} from './googleDriveService';
import { exportLocalBackupFile, pickAndReadLocalBackupFile } from './localFileService';
import { RestoreResult, restoreStateFromPayload } from './restoreService';
import { BackupPreviewInfo } from './types';

export const useBackupService = () => {
  const [backupSettings, setBackupSettings] = useRecoilState(backupSettingsState);

  const myLists = useRecoilValue(myListsAtom);
  const archivedLists = useRecoilValue(archivedListsAtom);
  const tudus = useRecoilValue(tudusAtom);
  const archivedTudus = useRecoilValue(archivedTudusAtom);
  const unlistedTudus = useRecoilValue(unlistedTudusAtom);
  const counters = useRecoilValue(countersAtom);
  const emojiUsage = useRecoilValue(emojiUsageState);
  const showOutdatedTudus = useRecoilValue(showOutdatedTudusAtom);
  const notificationSettings = useRecoilValue(notificationSettingsState);
  const aiSettings = useRecoilValue(aiSettingsState);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const getSerializedJson = useCallback(() => {
    return serializeBackupToJson({
      myLists,
      archivedLists,
      tudus,
      archivedTudus,
      unlistedTudus,
      counters,
      emojiUsage,
      showOutdatedTudus,
      notificationSettings,
      aiSettings,
    });
  }, [
    myLists,
    archivedLists,
    tudus,
    archivedTudus,
    unlistedTudus,
    counters,
    emojiUsage,
    showOutdatedTudus,
    notificationSettings,
    aiSettings,
  ]);

  const connectGoogle = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Conectando à Conta Google...');
    try {
      const user = await signInWithGoogle();
      setBackupSettings(prev => ({
        ...prev,
        googleUser: user,
      }));
      return user;
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [setBackupSettings]);

  const disconnectGoogle = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Desconectando conta...');
    try {
      await signOutFromGoogle();
      setBackupSettings(prev => ({
        ...prev,
        googleUser: null,
        autoBackupEnabled: false,
      }));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [setBackupSettings]);

  const checkGoogleSession = useCallback(async () => {
    const silentUser = await signInSilentlyWithGoogle();
    if (silentUser) {
      setBackupSettings(prev => ({
        ...prev,
        googleUser: silentUser,
      }));
    }
    return silentUser;
  }, [setBackupSettings]);

  const backupToGoogleDrive = useCallback(async (): Promise<{
    filename: string;
    date: Date;
  }> => {
    setIsLoading(true);
    setLoadingMessage('Enviando backup para o Google Drive...');
    try {
      const json = getSerializedJson();
      const date = new Date();
      const filename = generateBackupFilename(date);

      await uploadGoogleDriveBackup(json, filename);

      const nowIso = date.toISOString();
      setBackupSettings(prev => ({
        ...prev,
        lastCloudBackupDate: nowIso,
      }));

      return { filename, date };
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [getSerializedJson, setBackupSettings]);

  const fetchLatestCloudBackupPreview = useCallback(async (): Promise<BackupPreviewInfo> => {
    setIsLoading(true);
    setLoadingMessage('Buscando backup no Google Drive...');
    try {
      const file = await getLatestGoogleDriveBackup();
      if (!file) {
        throw new Error('Nenhum backup encontrado no Google Drive.');
      }

      setLoadingMessage('Baixando dados do backup...');
      const content = await downloadGoogleDriveBackupContent(file.id);
      const payload = parseAndValidateBackupPayload(content);
      return getBackupPreview(payload, 'google_drive');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const exportLocalBackup = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Exportando arquivo de backup...');
    try {
      const json = getSerializedJson();
      const date = new Date();
      const filename = generateBackupFilename(date);

      await exportLocalBackupFile(json, filename);

      const nowIso = date.toISOString();
      setBackupSettings(prev => ({
        ...prev,
        lastLocalBackupDate: nowIso,
      }));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [getSerializedJson, setBackupSettings]);

  const pickLocalBackupFileForPreview = useCallback(async (): Promise<BackupPreviewInfo> => {
    setIsLoading(true);
    setLoadingMessage('Lendo arquivo de backup...');
    try {
      const { content } = await pickAndReadLocalBackupFile();
      const payload = parseAndValidateBackupPayload(content);
      return getBackupPreview(payload, 'local_file');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const restoreFromPreview = useCallback(
    async (preview: BackupPreviewInfo): Promise<RestoreResult> => {
      setIsLoading(true);
      setLoadingMessage('Restaurando listas e tarefas...');
      try {
        const result = await restoreStateFromPayload(preview.rawPayload);
        return result;
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    },
    [],
  );

  const toggleAutoBackup = useCallback(
    async (enabled: boolean) => {
      if (enabled && !backupSettings.googleUser) {
        const user = await connectGoogle();
        if (!user) {
          return;
        }
      }
      setBackupSettings(prev => ({
        ...prev,
        autoBackupEnabled: enabled,
      }));
    },
    [backupSettings.googleUser, connectGoogle, setBackupSettings],
  );

  const setAutoBackupFrequency = useCallback(
    (freq: AutoBackupFrequency) => {
      setBackupSettings(prev => ({
        ...prev,
        autoBackupFrequency: freq,
      }));
    },
    [setBackupSettings],
  );

  const toggleReminder = useCallback(
    (enabled: boolean) => {
      setBackupSettings(prev => ({
        ...prev,
        reminderEnabled: enabled,
      }));
    },
    [setBackupSettings],
  );

  const setReminderIntervalDays = useCallback(
    (days: number) => {
      setBackupSettings(prev => ({
        ...prev,
        reminderIntervalDays: days,
      }));
    },
    [setBackupSettings],
  );

  const dismissReminderForToday = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setBackupSettings(prev => ({
      ...prev,
      lastReminderDismissedDate: todayStr,
    }));
  }, [setBackupSettings]);

  return {
    backupSettings,
    isLoading,
    loadingMessage,
    connectGoogle,
    disconnectGoogle,
    checkGoogleSession,
    backupToGoogleDrive,
    fetchLatestCloudBackupPreview,
    exportLocalBackup,
    pickLocalBackupFileForPreview,
    restoreFromPreview,
    toggleAutoBackup,
    setAutoBackupFrequency,
    toggleReminder,
    setReminderIntervalDays,
    dismissReminderForToday,
  };
};
