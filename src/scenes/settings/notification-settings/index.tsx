import React, { useCallback, useMemo, useState } from 'react';
import { Switch, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import { AdjustIcon } from '../../../components/animated-icons/adjust-icon';
import { DefaultHeader } from '../../../components/default-header';
import { Page } from '../../../components/page';
import { PageContent } from '../../../components/page-content';
import { styles } from '../../home/styles';
import { useNotificationSettings } from '../../../service/notification';
import { useScheduledTuduService } from '../../../service/list-service-hook/useScheduledTuduService';
import { notificationService } from '../../../service/notification';
import {
  Card,
  Container,
  EmojiIcon,
  InfoBadge,
  InfoText,
  SecondaryButton,
  SecondaryButtonText,
  Section,
  SectionTitle,
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
    sendTestNotification,
  } = useNotificationSettings();
  const { getTudusForDate } = useScheduledTuduService();

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const selectedTimeDate = useMemo(() => {
    const d = new Date();
    d.setHours(settings.dailyDigestHour, settings.dailyDigestMinute, 0, 0);
    return d;
  }, [settings.dailyDigestHour, settings.dailyDigestMinute]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTimePickerChange = useCallback(
    (newDate: Date) => {
      const h = newDate.getHours();
      const m = newDate.getMinutes();
      setDailyDigestTime(h, m);
      const tudusForToday = getTudusForDate(new Date());
      notificationService.scheduleDailyDigest(
        tudusForToday,
        h,
        m,
        settings.dailyDigestEnabled,
      );
    },
    [getTudusForDate, setDailyDigestTime, settings.dailyDigestEnabled],
  );

  const handleShortcutPress = useCallback(
    (hour: number, minute: number) => {
      setDailyDigestTime(hour, minute);
      const tudusForToday = getTudusForDate(new Date());
      notificationService.scheduleDailyDigest(
        tudusForToday,
        hour,
        minute,
        settings.dailyDigestEnabled,
      );
    },
    [getTudusForDate, setDailyDigestTime, settings.dailyDigestEnabled],
  );

  const handleToggleDailyDigest = useCallback(
    async (value: boolean) => {
      await toggleDailyDigest(value);
      const tudusForToday = getTudusForDate(new Date());
      notificationService.scheduleDailyDigest(
        tudusForToday,
        settings.dailyDigestHour,
        settings.dailyDigestMinute,
        value,
      );
    },
    [
      getTudusForDate,
      settings.dailyDigestHour,
      settings.dailyDigestMinute,
      toggleDailyDigest,
    ],
  );

  const handleTestPress = useCallback(async () => {
    try {
      await sendTestNotification();
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
  }, [sendTestNotification, t]);

  return (
    <Page>
      <DefaultHeader
        Icon={AdjustIcon}
        title={t('settings.notifications.title')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <Container>
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
