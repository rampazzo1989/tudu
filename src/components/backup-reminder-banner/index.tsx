import React, { memo, useCallback } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useBackupReminder } from '../../service/backup/useBackupReminder';
import { useBackupService } from '../../service/backup/useBackupService';
import {
  ActionRow,
  BannerContainer,
  BannerMessage,
  BannerTitle,
  BannerWrapper,
  DismissButton,
  DismissButtonText,
  IconContainer,
  PrimaryAction,
  PrimaryActionText,
  SnoozeButton,
  SnoozeButtonText,
  TitleGroup,
  TopRow,
} from './styles';

interface BackupReminderBannerProps {
  onNavigateToBackupSettings?: () => void;
}

export const BackupReminderBanner: React.FC<BackupReminderBannerProps> = memo(
  ({ onNavigateToBackupSettings }) => {
    const { t } = useTranslation();
    const reminderInfo = useBackupReminder();
    const {
      backupSettings,
      backupToGoogleDrive,
      connectGoogle,
      dismissReminderForToday,
      isLoading,
    } = useBackupService();

    const handleQuickBackup = useCallback(async () => {
      try {
        if (!backupSettings.googleUser) {
          const user = await connectGoogle();
          if (!user) {
            return;
          }
        }

        await backupToGoogleDrive();
        dismissReminderForToday();
        Toast.show({
          type: 'success',
          text1: t('settings.backup.backupSuccessTitle', { defaultValue: 'Backup realizado!' }),
          text2: t('settings.backup.backupSuccessMsg', { defaultValue: 'Seus dados estão salvos no Google Drive.' }),
        });
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: t('settings.backup.backupErrorTitle', { defaultValue: 'Erro no Backup' }),
          text2: err.message || t('settings.backup.backupErrorMsg', { defaultValue: 'Não foi possível concluir o backup.' }),
        });
        if (onNavigateToBackupSettings) {
          onNavigateToBackupSettings();
        }
      }
    }, [
      backupSettings.googleUser,
      connectGoogle,
      backupToGoogleDrive,
      dismissReminderForToday,
      t,
      onNavigateToBackupSettings,
    ]);

    if (!reminderInfo.shouldShow) {
      return null;
    }

    const message = reminderInfo.isNever
      ? t('settings.backup.reminderNeverMsg', {
          defaultValue: 'Você ainda não fez backup das suas tarefas. Conecte ao Google Drive para não perder seus dados.',
        })
      : t('settings.backup.reminderElapsedMsg', {
          days: reminderInfo.daysElapsed,
          defaultValue: 'Seu último backup foi feito há {{days}} dias. Mantenha seus dados atualizados na nuvem.',
        });

    return (
      <BannerWrapper>
        <BannerContainer>
          <TopRow>
            <TitleGroup>
              <IconContainer>
                <Text style={{ fontSize: 16 }}>🛡️</Text>
              </IconContainer>
              <BannerTitle>{t('settings.backup.reminderTitle', { defaultValue: 'Lembrete de Backup' })}</BannerTitle>
            </TitleGroup>
            <DismissButton onPress={dismissReminderForToday}>
              <DismissButtonText>✕</DismissButtonText>
            </DismissButton>
          </TopRow>

          <BannerMessage>{message}</BannerMessage>

          <ActionRow>
            <SnoozeButton onPress={dismissReminderForToday}>
              <SnoozeButtonText>{t('settings.backup.snooze', { defaultValue: 'Lembrar mais tarde' })}</SnoozeButtonText>
            </SnoozeButton>
            <PrimaryAction onPress={handleQuickBackup} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <PrimaryActionText>
                  {backupSettings.googleUser
                    ? t('settings.backup.backupNow', { defaultValue: 'Fazer Backup' })
                    : t('settings.backup.connectAndBackup', { defaultValue: 'Conectar & Salvar' })}
                </PrimaryActionText>
              )}
            </PrimaryAction>
          </ActionRow>
        </BannerContainer>
      </BannerWrapper>
    );
  },
);
