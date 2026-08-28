import React, {useEffect} from 'react';
import notifee, {EventType} from '@notifee/react-native';
import {useRecoilValue} from 'recoil';
import {notificationSettingsState} from '../../../state/atoms';
import {useListService} from '../../list-service-hook/useListService';
import {useScheduledTuduService} from '../../list-service-hook/useScheduledTuduService';
import {notificationService} from '../notificationService';
import {navigateToToday} from '../../../navigation/navigation-ref';

export const NotificationBootSync: React.FC = () => {
  const {getAllTudus} = useListService();
  const {getTudusForDate} = useScheduledTuduService();
  const notificationSettings = useRecoilValue(notificationSettingsState);

  // 1. Sync notifications on boot/state update
  useEffect(() => {
    const sync = async () => {
      await notificationService.init();
      const allTudus = getAllTudus();

      // Determine target date for Daily Digest (today if before digest time, tomorrow if after)
      const now = Date.now();
      const targetDigestDate = new Date();
      targetDigestDate.setHours(
        notificationSettings.dailyDigestHour,
        notificationSettings.dailyDigestMinute,
        0,
        0,
      );

      if (targetDigestDate.getTime() <= now) {
        targetDigestDate.setDate(targetDigestDate.getDate() + 1);
      }

      const tudusForDigest = getTudusForDate(targetDigestDate);
      await notificationService.syncAll(
        allTudus,
        tudusForDigest,
        notificationSettings,
        targetDigestDate,
      );
    };

    sync();
  }, [getAllTudus, getTudusForDate, notificationSettings]);

  // 2. Handle notification interactions (foreground and cold-boot)
  useEffect(() => {
    // Check if app was opened from a notification when completely closed
    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        navigateToToday();
      }
    };

    checkInitialNotification();

    // Listen for notification press while app is open / foregrounded
    const unsubscribe = notifee.onForegroundEvent(({type}) => {
      if (type === EventType.PRESS) {
        navigateToToday();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

