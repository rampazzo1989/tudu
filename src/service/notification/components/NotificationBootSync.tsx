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
      const todayTudus = getTudusForDate(new Date());
      await notificationService.syncAll(
        allTudus,
        todayTudus,
        notificationSettings,
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

