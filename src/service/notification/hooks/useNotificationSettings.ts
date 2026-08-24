import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {notificationSettingsState, NotificationSettingsState} from '../../../state/atoms';
import {notificationService} from '../notificationService';
import {DEFAULT_NOTIFICATION_SOUND, NotificationSound} from '../types';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useRecoilState(notificationSettingsState);

  const toggleTimedNotifications = useCallback(
    async (value?: boolean) => {
      const nextValue =
        value !== undefined ? value : !settings.timedNotificationsEnabled;
      if (nextValue) {
        await notificationService.requestPermissions();
      }
      setSettings(prev => ({
        ...prev,
        timedNotificationsEnabled: nextValue,
      }));
    },
    [settings.timedNotificationsEnabled, setSettings],
  );

  const toggleDailyDigest = useCallback(
    async (value?: boolean) => {
      const nextValue =
        value !== undefined ? value : !settings.dailyDigestEnabled;
      if (nextValue) {
        await notificationService.requestPermissions();
      }
      setSettings(prev => ({
        ...prev,
        dailyDigestEnabled: nextValue,
      }));
    },
    [settings.dailyDigestEnabled, setSettings],
  );

  const setDailyDigestTime = useCallback(
    (hour: number, minute: number) => {
      setSettings(prev => ({
        ...prev,
        dailyDigestHour: hour,
        dailyDigestMinute: minute,
      }));
    },
    [setSettings],
  );

  const setNotificationSound = useCallback(
    async (sound: NotificationSound) => {
      notificationService.setSound(sound);
      setSettings(prev => ({
        ...prev,
        notificationSound: sound,
      }));
    },
    [setSettings],
  );

  const updateSettings = useCallback(
    (newSettings: Partial<NotificationSettingsState>) => {
      setSettings(prev => ({
        ...prev,
        ...newSettings,
      }));
    },
    [setSettings],
  );

  const sendTestNotification = useCallback(
    async (sound?: NotificationSound) => {
      await notificationService.sendTestNotification(
        sound || settings.notificationSound || DEFAULT_NOTIFICATION_SOUND,
      );
    },
    [settings.notificationSound],
  );

  return {
    settings,
    toggleTimedNotifications,
    toggleDailyDigest,
    setDailyDigestTime,
    setNotificationSound,
    updateSettings,
    sendTestNotification,
  };
};

