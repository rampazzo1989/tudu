import React, {useEffect} from 'react';
import notifee, {EventType} from '@notifee/react-native';
import {useRecoilValue} from 'recoil';
import {notificationSettingsState} from '../../../state/atoms';
import {useListService} from '../../list-service-hook/useListService';
import {useScheduledTuduService} from '../../list-service-hook/useScheduledTuduService';
import {notificationService} from '../notificationService';
import {navigateToIncomingCall, navigateToToday} from '../../../navigation/navigation-ref';

export const NotificationBootSync: React.FC = () => {
  const {getAllTudus} = useListService();
  const {getTudusForDate} = useScheduledTuduService();
  const notificationSettings = useRecoilValue(notificationSettingsState);

  // 1. Sync notifications on boot/state update
  useEffect(() => {
    const sync = async () => {
      await notificationService.init();
      notificationService.setCallRemindersEnabled(
        Boolean(notificationSettings.callRemindersEnabled),
      );
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

  // 2. Handle notification interactions (foreground, delivered, and cold-boot)
  useEffect(() => {
    const handleNotificationInteraction = (
      notification: any,
      pressActionId?: string,
    ) => {
      if (!notification) return;
      if (pressActionId === 'call_decline') {
        return;
      }

      const data = notification.data;
      const isCall =
        data?.type === 'call_reminder' ||
        notification.id?.startsWith('call_tudu_') ||
        pressActionId === 'call' ||
        pressActionId === 'call_answer';

      console.log(
        `📱 [NotificationBootSync] Interação com notificação: isCall=${isCall}, pressActionId=${pressActionId}`,
      );

      if (isCall) {
        navigateToIncomingCall({
          tuduId: data?.tuduId,
          tuduTitle:
            data?.taskTitle || notification.body || 'Lembrete do Tudú',
          listName: data?.listName,
          listId: data?.listId,
          isTest: Boolean(data?.isTest),
          autoAnswer: pressActionId === 'call_answer',
        });
      } else {
        navigateToToday();
      }
    };

    // Check if app was opened from a notification when completely closed
    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification?.notification) {
        console.log(
          '📱 [NotificationBootSync] Cold boot notification detectada:',
          initialNotification.notification.id,
        );
        handleNotificationInteraction(
          initialNotification.notification,
          initialNotification.pressAction?.id,
        );
      }
    };

    checkInitialNotification();

    // Listen for notification events while app is open / foregrounded
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      const data = detail.notification?.data;
      const isCall =
        data?.type === 'call_reminder' ||
        detail.notification?.id?.startsWith('call_tudu_') ||
        detail.pressAction?.id === 'call' ||
        detail.pressAction?.id === 'call_answer';

      console.log(
        `📱 [NotificationBootSync] Foreground event: type=${type} (${EventType[type] || type}), isCall=${isCall}, id=${detail.notification?.id}`,
      );

      if (type === EventType.DELIVERED) {
        // When a call reminder is delivered at scheduled time with app open, start call screen immediately!
        if (isCall && detail.notification) {
          handleNotificationInteraction(detail.notification, 'call');
        }
      } else if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        handleNotificationInteraction(
          detail.notification,
          detail.pressAction?.id,
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

