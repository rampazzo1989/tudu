import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tudus as tudusAtom, unlistedTudus as unlistedTudusAtom } from '../../../scenes/home/state';
import { notificationSettingsState } from '../../../state/atoms';
import { notificationService } from '../notificationService';

export const useCallReminderBanner = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useRecoilState(notificationSettingsState);
  const tudusMap = useRecoilValue(tudusAtom);
  const unlistedTudusMap = useRecoilValue(unlistedTudusAtom);
  const [isLoading, setIsLoading] = useState(false);

  const hasAnyTimedTudu = useMemo(() => {
    if (settings.hasScheduledWithTime) {
      return true;
    }

    for (const [_, listMap] of tudusMap) {
      for (const [_, item] of listMap) {
        if (item.hasTime && item.dueDate && !item.done) {
          return true;
        }
      }
    }

    for (const [_, item] of unlistedTudusMap) {
      if (item.hasTime && item.dueDate && !item.done) {
        return true;
      }
    }

    return false;
  }, [settings.hasScheduledWithTime, tudusMap, unlistedTudusMap]);

  const shouldShow = useMemo(() => {
    if (settings.callRemindersEnabled) {
      return false;
    }
    if (settings.callReminderSuggestionDismissed) {
      return false;
    }
    return hasAnyTimedTudu;
  }, [
    settings.callRemindersEnabled,
    settings.callReminderSuggestionDismissed,
    hasAnyTimedTudu,
  ]);

  const dismissBanner = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      callReminderSuggestionDismissed: true,
    }));
  }, [setSettings]);

  const enableCallReminders = useCallback(async () => {
    setIsLoading(true);
    try {
      await notificationService.requestPermissions();
      setSettings(prev => ({
        ...prev,
        callRemindersEnabled: true,
        callReminderSuggestionDismissed: true,
      }));
      Toast.show({
        type: 'success',
        text1: t('settings.notifications.callReminder.bannerSuccessToastTitle', {
          defaultValue: 'Lembretes por Ligação ativados!',
        }),
        text2: t('settings.notifications.callReminder.bannerSuccessToastMsg', {
          defaultValue: 'Você receberá chamadas quando seus tudús com horário vencerem.',
        }),
      });
    } catch (err) {
      console.warn('[useCallReminderBanner] Error enabling call reminders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setSettings, t]);

  return {
    shouldShow,
    isLoading,
    enableCallReminders,
    dismissBanner,
  };
};
