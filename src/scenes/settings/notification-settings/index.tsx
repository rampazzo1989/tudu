import React, { useCallback, useMemo, useState } from 'react';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SettingsIcon } from '../../../components/animated-icons/settings-icon';
import { DefaultHeader } from '../../../components/default-header';
import { Page } from '../../../components/page';
import { PageContent } from '../../../components/page-content';
import { styles } from '../../home/styles';
import { useNotificationSettings } from '../../../service/notification';
import { useScheduledTuduService } from '../../../service/list-service-hook/useScheduledTuduService';
import { notificationService } from '../../../service/notification';
import {
  DEFAULT_NOTIFICATION_SOUND,
  NOTIFICATION_SOUND_OPTIONS,
  NotificationSound,
} from '../../../service/notification/types';
import {
  Card,
  Container,
  DefaultBadge,
  DefaultBadgeText,
  EmojiIcon,
  InfoBadge,
  InfoText,
  SecondaryButton,
  SecondaryButtonText,
  Section,
  SectionTitle,
  SoundCard,
  SoundCardContent,
  SoundDescription,
  SoundIconContainer,
  SoundInfoColumn,
  SoundOptionsContainer,
  SoundRadioInner,
  SoundRadioOuter,
  SoundTitle,
  SoundTitleRow,
  StatusFeedback,
  StatusFeedbackText,
  TimeChip,
  TimeChipsContainer,
  TimeChipText,
  TimePickerSectionTitle,
  TimePickerWrapper,
  ToggleCard,
  ToggleDescription,
  ToggleTextContainer,
  ToggleTitle,
} from './styles';
import { NotificationSettingsPageProps } from './types';

const TIME_SHORTCUTS = [
  { label: '07:00', hour: 7, min: 0 },
  { label: '08:00', hour: 8, min: 0 },
  { label: '08:30', hour: 8, min: 30 },
  { label: '09:00', hour: 9, min: 0 },
  { label: '10:00', hour: 10, min: 0 },
];

const NotificationSettingsPage: React.FC<NotificationSettingsPageProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    settings,
    toggleTimedNotifications,
    toggleDailyDigest,
    setDailyDigestTime,
    setNotificationSound,
    sendTestNotification,
  } = useNotificationSettings();
  const { getTudusForDate } = useScheduledTuduService();

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const activeSound =
    settings.notificationSound || DEFAULT_NOTIFICATION_SOUND;

  const selectedTimeDate = useMemo(() => {
    const d = new Date();
    d.setHours(settings.dailyDigestHour, settings.dailyDigestMinute, 0, 0);
    return d;
  }, [settings.dailyDigestHour, settings.dailyDigestMinute]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getTargetDigestDate = useCallback((hour: number, minute: number): Date => {
    const now = Date.now();
    const targetDate = new Date();
    targetDate.setHours(hour, minute, 0, 0);
    if (targetDate.getTime() <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    return targetDate;
  }, []);

  const handleTimePickerChange = useCallback(
    (newDate: Date) => {
      const h = newDate.getHours();
      const m = newDate.getMinutes();
      setDailyDigestTime(h, m);
      const targetDate = getTargetDigestDate(h, m);
      const tudusForDigest = getTudusForDate(targetDate);
      notificationService.scheduleDailyDigest(
        tudusForDigest,
        h,
        m,
        settings.dailyDigestEnabled,
        activeSound,
        targetDate,
      );
    },
    [activeSound, getTargetDigestDate, getTudusForDate, setDailyDigestTime, settings.dailyDigestEnabled],
  );

  const handleShortcutPress = useCallback(
    (hour: number, minute: number) => {
      setDailyDigestTime(hour, minute);
      const targetDate = getTargetDigestDate(hour, minute);
      const tudusForDigest = getTudusForDate(targetDate);
      notificationService.scheduleDailyDigest(
        tudusForDigest,
        hour,
        minute,
        settings.dailyDigestEnabled,
        activeSound,
        targetDate,
      );
    },
    [activeSound, getTargetDigestDate, getTudusForDate, setDailyDigestTime, settings.dailyDigestEnabled],
  );

  const handleToggleDailyDigest = useCallback(
    async (value: boolean) => {
      await toggleDailyDigest(value);
      const targetDate = getTargetDigestDate(
        settings.dailyDigestHour,
        settings.dailyDigestMinute,
      );
      const tudusForDigest = getTudusForDate(targetDate);
      notificationService.scheduleDailyDigest(
        tudusForDigest,
        settings.dailyDigestHour,
        settings.dailyDigestMinute,
        value,
        activeSound,
        targetDate,
      );
    },
    [
      activeSound,
      getTargetDigestDate,
      getTudusForDate,
      settings.dailyDigestHour,
      settings.dailyDigestMinute,
      toggleDailyDigest,
    ],
  );

  const handleSelectSound = useCallback(
    async (soundId: NotificationSound) => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      await setNotificationSound(soundId);
      try {
        await sendTestNotification(soundId);
      } catch {
        // Ignore test error on quick select
      }
    },
    [sendTestNotification, setNotificationSound],
  );

  const handleTestPress = useCallback(async () => {
    try {
      await sendTestNotification(activeSound);
      setTestResult({
        success: true,
        message: t('settings.notifications.testSuccess'),
      });
      setTimeout(() => setTestResult(null), 4000);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Erro ao enviar notificação de teste',
      });
    }
  }, [activeSound, sendTestNotification, t]);

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.notifications.title')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <Container>
          {/* Som da Notificação */}
          <Section>
            <SectionTitle>
              {t('settings.notifications.soundSectionTitle')}
            </SectionTitle>
            <SoundOptionsContainer>
              {NOTIFICATION_SOUND_OPTIONS.map(soundOpt => {
                const isSelected = activeSound === soundOpt.id;
                const isDefaultAppSound =
                  soundOpt.id === DEFAULT_NOTIFICATION_SOUND;

                return (
                  <SoundCard
                    key={soundOpt.id}
                    selected={isSelected}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSound(soundOpt.id)}>
                    <SoundCardContent>
                      <SoundIconContainer selected={isSelected}>
                        <EmojiIcon>{soundOpt.icon}</EmojiIcon>
                      </SoundIconContainer>
                      <SoundInfoColumn>
                        <SoundTitleRow>
                          <SoundTitle selected={isSelected}>
                            {t(soundOpt.nameKey)}
                          </SoundTitle>
                          {isDefaultAppSound && (
                            <DefaultBadge>
                              <DefaultBadgeText>
                                {t('settings.notifications.sounds.defaultBadge')}
                              </DefaultBadgeText>
                            </DefaultBadge>
                          )}
                        </SoundTitleRow>
                        <SoundDescription>
                          {t(soundOpt.descriptionKey)}
                        </SoundDescription>
                      </SoundInfoColumn>
                    </SoundCardContent>
                    <SoundRadioOuter selected={isSelected}>
                      {isSelected && <SoundRadioInner />}
                    </SoundRadioOuter>
                  </SoundCard>
                );
              })}
            </SoundOptionsContainer>
          </Section>

          {/* Lembretes com Horário */}
          <Section>
            <SectionTitle>
              {t('settings.notifications.timedTitle')}
            </SectionTitle>
            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>
                  {t('settings.notifications.timedTitle')}
                </ToggleTitle>
                <ToggleDescription>
                  {t('settings.notifications.timedDescription')}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={settings.timedNotificationsEnabled}
                onValueChange={toggleTimedNotifications}
                trackColor={{
                  false: '#3C414A',
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>
          </Section>

          {/* Resumo Diário (Daily Digest) */}
          <Section>
            <SectionTitle>
              {t('settings.notifications.dailyDigestTitle')}
            </SectionTitle>
            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>
                  {t('settings.notifications.dailyDigestTitle')}
                </ToggleTitle>
                <ToggleDescription>
                  {t('settings.notifications.dailyDigestDescription')}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={settings.dailyDigestEnabled}
                onValueChange={handleToggleDailyDigest}
                trackColor={{
                  false: '#3C414A',
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>

            {settings.dailyDigestEnabled && (
              <Card>
                <TimePickerSectionTitle>
                  ⏰ {t('settings.notifications.dailyDigestTimeTitle')}
                </TimePickerSectionTitle>

                <TimeChipsContainer>
                  {TIME_SHORTCUTS.map(s => {
                    const isSelected =
                      settings.dailyDigestHour === s.hour &&
                      settings.dailyDigestMinute === s.min;
                    return (
                      <TimeChip
                        key={s.label}
                        selected={isSelected}
                        onPress={() => handleShortcutPress(s.hour, s.min)}>
                        <TimeChipText selected={isSelected}>
                          {s.label}
                        </TimeChipText>
                      </TimeChip>
                    );
                  })}
                </TimeChipsContainer>

                <TimePickerWrapper>
                  <DatePicker
                    date={selectedTimeDate}
                    onDateChange={handleTimePickerChange}
                    mode="time"
                    theme="dark"
                    is24hourSource="locale"
                  />
                </TimePickerWrapper>
              </Card>
            )}
          </Section>

          {/* Informação e Teste */}
          <Section>
            <SectionTitle>{t('settings.sections.general')}</SectionTitle>
            <Card>
              <SecondaryButton onPress={handleTestPress}>
                <SecondaryButtonText>
                  🔔 {t('settings.notifications.testButton')}
                </SecondaryButtonText>
              </SecondaryButton>

              {testResult && (
                <StatusFeedback isSuccess={testResult.success}>
                  <StatusFeedbackText isSuccess={testResult.success}>
                    {testResult.message}
                  </StatusFeedbackText>
                </StatusFeedback>
              )}

              <InfoBadge>
                <EmojiIcon>ℹ️</EmojiIcon>
                <InfoText>
                  {t('settings.notifications.permissionNotice')}
                </InfoText>
              </InfoBadge>
            </Card>
          </Section>
        </Container>
      </PageContent>
    </Page>
  );
};

export { NotificationSettingsPage };

