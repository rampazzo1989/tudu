import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { myLists as myListsAtom, tudus as tudusAtom } from '../../scenes/home/state';
import { backupSettingsState } from '../../state/atoms';
import { useBackupService } from './useBackupService';

export const useBackupReminder = () => {
  const backupSettings = useRecoilValue(backupSettingsState);
  const myLists = useRecoilValue(myListsAtom);
  const tudus = useRecoilValue(tudusAtom);
  const { backupToGoogleDrive } = useBackupService();

  const hasCheckedAutoBackup = useRef(false);

  // 1. Calculate reminder conditions
  const reminderInfo = useMemo(() => {
    if (!backupSettings.reminderEnabled) {
      return { shouldShow: false, daysElapsed: 0, isNever: false };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (backupSettings.lastReminderDismissedDate === todayStr) {
      return { shouldShow: false, daysElapsed: 0, isNever: false };
    }

    // Determine latest backup timestamp
    let latestTimestamp = 0;
    if (backupSettings.lastCloudBackupDate) {
      latestTimestamp = Math.max(
        latestTimestamp,
        new Date(backupSettings.lastCloudBackupDate).getTime(),
      );
    }
    if (backupSettings.lastLocalBackupDate) {
      latestTimestamp = Math.max(
        latestTimestamp,
        new Date(backupSettings.lastLocalBackupDate).getTime(),
      );
    }

    const now = Date.now();
    const hasData = myLists.size > 0 || tudus.size > 0;

    if (latestTimestamp === 0) {
      // Never backed up
      return {
        shouldShow: hasData,
        daysElapsed: 0,
        isNever: true,
      };
    }

    const daysElapsed = Math.floor((now - latestTimestamp) / (1000 * 60 * 60 * 24));

    if (daysElapsed >= backupSettings.reminderIntervalDays) {
      return {
        shouldShow: true,
        daysElapsed,
        isNever: false,
      };
    }

    return { shouldShow: false, daysElapsed, isNever: false };
  }, [
    backupSettings.reminderEnabled,
    backupSettings.lastReminderDismissedDate,
    backupSettings.lastCloudBackupDate,
    backupSettings.lastLocalBackupDate,
    backupSettings.reminderIntervalDays,
    myLists,
    tudus,
  ]);

  // 2. Trigger automatic backup on app open if schedule is due
  useEffect(() => {
    if (hasCheckedAutoBackup.current) {
      return;
    }
    hasCheckedAutoBackup.current = true;

    if (!backupSettings.autoBackupEnabled || !backupSettings.googleUser) {
      return;
    }

    const lastCloudTime = backupSettings.lastCloudBackupDate
      ? new Date(backupSettings.lastCloudBackupDate).getTime()
      : 0;

    const now = Date.now();
    const hoursElapsed = (now - lastCloudTime) / (1000 * 60 * 60);

    let isDue = false;
    if (backupSettings.autoBackupFrequency === 'daily' && hoursElapsed >= 24) {
      isDue = true;
    } else if (
      backupSettings.autoBackupFrequency === 'weekly' &&
      hoursElapsed >= 24 * 7
    ) {
      isDue = true;
    } else if (lastCloudTime === 0) {
      isDue = true;
    }

    if (isDue) {
      backupToGoogleDrive().catch(err => {
        console.warn('[AutoBackup] Background backup skipped/failed:', err);
      });
    }
  }, [
    backupSettings.autoBackupEnabled,
    backupSettings.googleUser,
    backupSettings.lastCloudBackupDate,
    backupSettings.autoBackupFrequency,
    backupToGoogleDrive,
  ]);

  return reminderInfo;
};
