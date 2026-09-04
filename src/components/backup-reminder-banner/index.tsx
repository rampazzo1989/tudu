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
      connectGoogle,
      dismissReminderForToday,
      isLoading,
    } = useBackupService();

    const handleActivateBackup = useCallback(async () => {
      try {
        if (!backupSettings.googleUser) {
          const user = await connectGoogle();
          if (!user) {
            return;
          }
          Toast.show({
            type: 'success',
            text1: t('settings.backup.connectSuccessTitle', { defaultValue: 'Conta conectada!' }),
            text2: t('settings.backup.connectSuccessMsg', { defaultValue: 'Sua conta Google foi conectada com sucesso.' }),
          });
        }

        dismissReminderForToday();

        if (onNavigateToBackupSettings) {
          onNavigateToBackupSettings();
        }
      } catch (err: any) {
        dismissReminderForToday();
        Toast.show({
          type: 'error',
          text1: t('settings.backup.connectErrorTitle', { defaultValue: 'Falha na Conexão' }),
          text2: err.message || t('settings.backup.connectErrorMsg', { defaultValue: 'Não foi possível autenticar com o Google.' }),
        });
        if (onNavigateToBackupSettings) {
          onNavigateToBackupSettings();
        }
      }
    }, [
      backupSettings.googleUser,
      connectGoogle,
      dismissReminderForToday,
      t,
      onNavigateToBackupSettings,
    ]);

    if (!reminderInfo.shouldShow) {
      return null;
    }

    const isFailure = Boolean(reminderInfo.isAutoBackupFailed);

    const message = isFailure
      ? t('settings.backup.autoBackupFailedReminderMsg', {
          defaultValue: 'Houve uma falha ao tentar fazer o backup automático no Google Drive. Toque para tentar novamente.',
        })
      : reminderInfo.isNever
      ? t('settings.backup.reminderNeverMsg', {
          defaultValue: 'Você ainda não fez backup das suas tarefas. Conecte ao Google Drive para não perder seus dados.',
        })
      : t('settings.backup.reminderElapsedMsg', {
          days: reminderInfo.daysElapsed,
          defaultValue: 'Seu último backup foi feito há {{days}} dias. Mantenha seus dados atualizados na nuvem.',
        });

    const title = isFailure
      ? t('settings.backup.autoBackupFailedReminderTitle', { defaultValue: 'Falha no Backup Automático' })
      : t('settings.backup.reminderTitle', { defaultValue: 'Lembrete de Backup' });

    return (
      <BannerWrapper>
        <BannerContainer>
          <TopRow>
            <TitleGroup>
              <IconContainer>
                <Text style={{ fontSize: 16 }}>{isFailure ? '⚠️' : '🛡️'}</Text>
              </IconContainer>
              <BannerTitle>{title}</BannerTitle>
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
            <PrimaryAction onPress={handleActivateBackup} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <PrimaryActionText>
                  {backupSettings.googleUser
                    ? t('settings.backup.configure', { defaultValue: 'Configurar' })
                    : t('settings.backup.activate', { defaultValue: 'Ativar' })}
                </PrimaryActionText>
              )}
            </PrimaryAction>
          </ActionRow>
        </BannerContainer>
      </BannerWrapper>
    );
  },
);
