import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Switch, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { SettingsIcon } from '../../../components/animated-icons/settings-icon';
import { BackupPreviewModal } from '../../../components/backup-preview-modal';
import { DefaultHeader } from '../../../components/default-header';
import { Page } from '../../../components/page';
import { PageContent } from '../../../components/page-content';
import { BackupPreviewInfo } from '../../../service/backup/types';
import { useBackupService } from '../../../service/backup/useBackupService';
import { styles } from '../../home/styles';
import {
  AccountCard,
  AccountDetails,
  AccountEmail,
  AccountInfo,
  AccountName,
  ActionIconContainer,
  ActionSubtitle,
  ActionTextContainer,
  ActionTile,
  ActionTileLeft,
  ActionTitle,
  AutoBackupErrorCard,
  Avatar,
  AvatarFallback,
  AvatarFallbackText,
  ChipButton,
  ChipsRow,
  ChipText,
  ConnectButton,
  ConnectButtonText,
  Container,
  DisconnectButton,
  DisconnectButtonText,
  ErrorCardContent,
  ErrorCardDate,
  ErrorCardMessage,
  ErrorCardTitle,
  InfoBadge,
  InfoText,
  LoadingOverlay,
  LoadingText,
  Section,
  SectionTitle,
  ToggleCard,
  ToggleDescription,
  ToggleTextContainer,
  ToggleTitle,
} from './styles';
import { BackupSettingsPageProps } from './types';

export const BackupSettingsPage: React.FC<BackupSettingsPageProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const {
    backupSettings,
    isLoading,
    loadingMessage,
    connectGoogle,
    disconnectGoogle,
    checkGoogleSession,
    backupToGoogleDrive,
    fetchLatestCloudBackupPreview,
    exportLocalBackup,
    pickLocalBackupFileForPreview,
    restoreFromPreview,
    toggleAutoBackup,
    setAutoBackupFrequency,
    toggleReminder,
    setReminderIntervalDays,
    toggleIncludeSettingsInBackup,
  } = useBackupService();

  const [previewData, setPreviewData] = useState<BackupPreviewInfo | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);

  useEffect(() => {
    checkGoogleSession();
  }, [checkGoogleSession]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleConnect = useCallback(async () => {
    try {
      await connectGoogle();
      Toast.show({
        type: 'success',
        text1: t('settings.backup.connectSuccessTitle', { defaultValue: 'Conta conectada!' }),
        text2: t('settings.backup.connectSuccessMsg', { defaultValue: 'Sua conta Google foi conectada com sucesso.' }),
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('settings.backup.connectErrorTitle', { defaultValue: 'Falha na Conexão' }),
        text2: err.message || t('settings.backup.connectErrorMsg', { defaultValue: 'Não foi possível autenticar com o Google.' }),
      });
    }
  }, [connectGoogle, t]);

  const handleDisconnect = useCallback(() => {
    Alert.alert(
      t('settings.backup.disconnectTitle', { defaultValue: 'Desconectar Google Drive' }),
      t('settings.backup.disconnectConfirm', {
        defaultValue: 'Deseja realmente desconectar sua conta Google? O backup automático será desativado.',
      }),
      [
        { text: t('buttons.cancel'), style: 'cancel' },
        {
          text: t('buttons.yes'),
          style: 'destructive',
          onPress: async () => {
            await disconnectGoogle();
            Toast.show({
              type: 'info',
              text1: t('settings.backup.disconnectedTitle', { defaultValue: 'Conta desconectada' }),
            });
          },
        },
      ],
    );
  }, [disconnectGoogle, t]);

  const handleCloudBackup = useCallback(async () => {
    try {
      if (!backupSettings.googleUser) {
        const user = await connectGoogle();
        if (!user) {
          return;
        }
      }

      await backupToGoogleDrive();
      Toast.show({
        type: 'success',
        text1: t('settings.backup.backupSuccessTitle', { defaultValue: 'Backup Concluído!' }),
        text2: t('settings.backup.backupSuccessMsg', { defaultValue: 'Dados salvos com sucesso no Google Drive.' }),
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('settings.backup.backupErrorTitle', { defaultValue: 'Erro no Backup' }),
        text2: err.message || t('settings.backup.backupErrorMsg', { defaultValue: 'Erro ao salvar no Google Drive.' }),
      });
    }
  }, [backupSettings.googleUser, connectGoogle, backupToGoogleDrive, t]);

  const handleCloudRestore = useCallback(async () => {
    try {
      if (!backupSettings.googleUser) {
        const user = await connectGoogle();
        if (!user) {
          return;
        }
      }

      const preview = await fetchLatestCloudBackupPreview();
      setPreviewData(preview);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('settings.backup.restoreFetchErrorTitle', { defaultValue: 'Backup Não Encontrado' }),
        text2: err.message || t('settings.backup.restoreFetchErrorMsg', { defaultValue: 'Nenhum backup encontrado no Google Drive.' }),
      });
    }
  }, [backupSettings.googleUser, connectGoogle, fetchLatestCloudBackupPreview, t]);

  const handleLocalExport = useCallback(async () => {
    try {
      await exportLocalBackup();
      Toast.show({
        type: 'success',
        text1: t('settings.backup.exportSuccessTitle', { defaultValue: 'Arquivo Gerado' }),
        text2: t('settings.backup.exportSuccessMsg', { defaultValue: 'Backup pronto para compartilhamento ou salvamento.' }),
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('settings.backup.exportErrorTitle', { defaultValue: 'Erro ao Exportar' }),
        text2: err.message || t('settings.backup.exportErrorMsg', { defaultValue: 'Não foi possível exportar o arquivo.' }),
      });
    }
  }, [exportLocalBackup, t]);

  const handleLocalImport = useCallback(async () => {
    try {
      const preview = await pickLocalBackupFileForPreview();
      setPreviewData(preview);
    } catch (err: any) {
      if (err.message && !err.message.includes('cancelad')) {
        Toast.show({
          type: 'error',
          text1: t('settings.backup.importErrorTitle', { defaultValue: 'Erro ao Ler Arquivo' }),
          text2: err.message || t('settings.backup.importErrorMsg', { defaultValue: 'Arquivo de backup inválido.' }),
        });
      }
    }
  }, [pickLocalBackupFileForPreview, t]);

  const handleConfirmRestore = useCallback(async () => {
    if (!previewData) {
      return;
    }
    setIsRestoring(true);
    try {
      const result = await restoreFromPreview(previewData);
      setPreviewData(null);
      Toast.show({
        type: 'success',
        text1: t('settings.backup.restoreSuccessTitle', { defaultValue: 'Restauração Concluída!' }),
        text2: t('settings.backup.restoreSuccessSummary', {
          lists: result.listsRestored,
          tudus: result.tudusRestored,
          defaultValue: '{{lists}} listas e {{tudus}} tarefas restauradas com sucesso.',
        }),
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('settings.backup.restoreErrorTitle', { defaultValue: 'Erro na Restauração' }),
        text2: err.message || t('settings.backup.restoreErrorMsg', { defaultValue: 'Falha ao restaurar dados.' }),
      });
    } finally {
      setIsRestoring(false);
    }
  }, [previewData, restoreFromPreview, t]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) {
      return t('settings.backup.never', { defaultValue: 'Nunca realizado' });
    }
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const userInitials = backupSettings.googleUser?.name
    ? backupSettings.googleUser.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.backup.pageTitle', { defaultValue: 'Backup & Restauração' })}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <Container>
          {/* Loading Indicator */}
          {isLoading && (
            <LoadingOverlay>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <LoadingText>{loadingMessage}</LoadingText>
            </LoadingOverlay>
          )}

          {/* Section: Google Account */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionAccount', { defaultValue: 'Conta Google' })}</SectionTitle>
            {backupSettings.googleUser ? (
              <AccountCard>
                <AccountInfo>
                  {backupSettings.googleUser.photo ? (
                    <Avatar source={{ uri: backupSettings.googleUser.photo }} />
                  ) : (
                    <AvatarFallback>
                      <AvatarFallbackText>{userInitials}</AvatarFallbackText>
                    </AvatarFallback>
                  )}
                  <AccountDetails>
                    <AccountName numberOfLines={1}>{backupSettings.googleUser.name}</AccountName>
                    <AccountEmail numberOfLines={1}>{backupSettings.googleUser.email}</AccountEmail>
                  </AccountDetails>
                </AccountInfo>
                <DisconnectButton onPress={handleDisconnect}>
                  <DisconnectButtonText>{t('settings.backup.disconnect', { defaultValue: 'Sair' })}</DisconnectButtonText>
                </DisconnectButton>
              </AccountCard>
            ) : (
              <ConnectButton onPress={handleConnect} disabled={isLoading}>
                <Text style={{ fontSize: 18 }}>🇬</Text>
                <ConnectButtonText>{t('settings.backup.connectGoogle', { defaultValue: 'Conectar Google Drive' })}</ConnectButtonText>
              </ConnectButton>
            )}
          </Section>

          {/* Section: Google Drive Backups */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionCloud', { defaultValue: 'Google Drive (Nuvem)' })}</SectionTitle>
            
            <ActionTile onPress={handleCloudBackup} disabled={isLoading}>
              <ActionTileLeft>
                <ActionIconContainer>
                  <Text style={{ fontSize: 20 }}>☁️</Text>
                </ActionIconContainer>
                <ActionTextContainer>
                  <ActionTitle>{t('settings.backup.backupCloudTitle', { defaultValue: 'Fazer Backup Agora' })}</ActionTitle>
                  <ActionSubtitle>
                    {t('settings.backup.lastCloudBackup', {
                      date: formatDate(backupSettings.lastCloudBackupDate),
                      defaultValue: 'Último backup: {{date}}',
                    })}
                  </ActionSubtitle>
                </ActionTextContainer>
              </ActionTileLeft>
              <Text style={{ fontSize: 18 }}>⬆️</Text>
            </ActionTile>

            <ActionTile onPress={handleCloudRestore} disabled={isLoading}>
              <ActionTileLeft>
                <ActionIconContainer>
                  <Text style={{ fontSize: 20 }}>📥</Text>
                </ActionIconContainer>
                <ActionTextContainer>
                  <ActionTitle>{t('settings.backup.restoreCloudTitle', { defaultValue: 'Restaurar do Google Drive' })}</ActionTitle>
                  <ActionSubtitle>
                    {t('settings.backup.restoreCloudSubtitle', {
                      defaultValue: 'Substitui dados atuais pelo último backup salvo na nuvem',
                    })}
                  </ActionSubtitle>
                </ActionTextContainer>
              </ActionTileLeft>
              <Text style={{ fontSize: 18 }}>⬇️</Text>
            </ActionTile>
          </Section>

          {/* Section: Local File Backups */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionLocal', { defaultValue: 'Arquivo Local (.json)' })}</SectionTitle>

            <ActionTile onPress={handleLocalExport} disabled={isLoading}>
              <ActionTileLeft>
                <ActionIconContainer>
                  <Text style={{ fontSize: 20 }}>💾</Text>
                </ActionIconContainer>
                <ActionTextContainer>
                  <ActionTitle>{t('settings.backup.exportLocalTitle', { defaultValue: 'Exportar Arquivo de Backup' })}</ActionTitle>
                  <ActionSubtitle>
                    {t('settings.backup.lastLocalBackup', {
                      date: formatDate(backupSettings.lastLocalBackupDate),
                      defaultValue: 'Última exportação: {{date}}',
                    })}
                  </ActionSubtitle>
                </ActionTextContainer>
              </ActionTileLeft>
              <Text style={{ fontSize: 18 }}>📤</Text>
            </ActionTile>

            <ActionTile onPress={handleLocalImport} disabled={isLoading}>
              <ActionTileLeft>
                <ActionIconContainer>
                  <Text style={{ fontSize: 20 }}>📂</Text>
                </ActionIconContainer>
                <ActionTextContainer>
                  <ActionTitle>{t('settings.backup.importLocalTitle', { defaultValue: 'Restaurar a partir de Arquivo' })}</ActionTitle>
                  <ActionSubtitle>
                    {t('settings.backup.importLocalSubtitle', {
                      defaultValue: 'Selecione um arquivo .json salvo no seu dispositivo',
                    })}
                  </ActionSubtitle>
                </ActionTextContainer>
              </ActionTileLeft>
              <Text style={{ fontSize: 18 }}>📂</Text>
            </ActionTile>
          </Section>

          {/* Section: Backup Content */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionContent', { defaultValue: 'Conteúdo do Backup' })}</SectionTitle>

            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>{t('settings.backup.includeSettingsTitle', { defaultValue: 'Incluir configurações no backup' })}</ToggleTitle>
                <ToggleDescription>
                  {t('settings.backup.includeSettingsDesc', {
                    defaultValue: 'Salva preferências de notificações, segurança, IA, consumo de tokens e visual',
                  })}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={backupSettings.includeSettingsInBackup ?? true}
                onValueChange={toggleIncludeSettingsInBackup}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#7956BF' }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>
          </Section>

          {/* Section: Automatic Backups */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionAuto', { defaultValue: 'Backup Automático' })}</SectionTitle>

            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>{t('settings.backup.autoBackupTitle', { defaultValue: 'Backup Automático na Nuvem' })}</ToggleTitle>
                <ToggleDescription>
                  {t('settings.backup.autoBackupDesc', {
                    defaultValue: 'Salva suas listas periodicamente em segundo plano no Google Drive',
                  })}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={backupSettings.autoBackupEnabled}
                onValueChange={toggleAutoBackup}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#7956BF' }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>

            {backupSettings.autoBackupEnabled && (
              <ChipsRow>
                <ChipButton
                  selected={backupSettings.autoBackupFrequency === 'daily'}
                  onPress={() => setAutoBackupFrequency('daily')}>
                  <ChipText selected={backupSettings.autoBackupFrequency === 'daily'}>
                    {t('settings.backup.freqDaily', { defaultValue: 'Diário' })}
                  </ChipText>
                </ChipButton>
                <ChipButton
                  selected={backupSettings.autoBackupFrequency === 'weekly'}
                  onPress={() => setAutoBackupFrequency('weekly')}>
                  <ChipText selected={backupSettings.autoBackupFrequency === 'weekly'}>
                    {t('settings.backup.freqWeekly', { defaultValue: 'Semanal' })}
                  </ChipText>
                </ChipButton>
              </ChipsRow>
            )}

            {backupSettings.lastAutoBackupError && (
              <AutoBackupErrorCard>
                <Text style={{ fontSize: 18 }}>⚠️</Text>
                <ErrorCardContent>
                  <ErrorCardTitle>
                    {t('settings.backup.autoBackupErrorTitle', { defaultValue: 'Falha no Backup Automático' })}
                  </ErrorCardTitle>
                  <ErrorCardMessage>{backupSettings.lastAutoBackupError}</ErrorCardMessage>
                  {backupSettings.lastAutoBackupErrorDate && (
                    <ErrorCardDate>
                      {t('settings.backup.failedAt', {
                        date: formatDate(backupSettings.lastAutoBackupErrorDate),
                        defaultValue: 'Ocorrido em: {{date}}',
                      })}
                    </ErrorCardDate>
                  )}
                </ErrorCardContent>
              </AutoBackupErrorCard>
            )}
          </Section>

          {/* Section: Periodic Reminders */}
          <Section>
            <SectionTitle>{t('settings.backup.sectionReminders', { defaultValue: 'Lembretes no App' })}</SectionTitle>

            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>{t('settings.backup.remindersTitle', { defaultValue: 'Lembrar de fazer backup' })}</ToggleTitle>
                <ToggleDescription>
                  {backupSettings.autoBackupEnabled && backupSettings.googleUser
                    ? t('settings.backup.remindersDescAutoActive', {
                        defaultValue: 'O backup automático está ativo. Os lembretes na tela inicial permanecerão pausados.',
                      })
                    : t('settings.backup.remindersDesc', {
                        defaultValue: 'Exibe um aviso na tela inicial quando passar muito tempo sem backup',
                      })}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={backupSettings.reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#7956BF' }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>

            {backupSettings.reminderEnabled && (
              <ChipsRow>
                {[7, 15, 30].map(days => (
                  <ChipButton
                    key={days}
                    selected={backupSettings.reminderIntervalDays === days}
                    onPress={() => setReminderIntervalDays(days)}>
                    <ChipText selected={backupSettings.reminderIntervalDays === days}>
                      {t('settings.backup.intervalDays', { count: days, defaultValue: 'A cada {{count}} dias' })}
                    </ChipText>
                  </ChipButton>
                ))}
              </ChipsRow>
            )}

            <InfoBadge>
              <Text style={{ fontSize: 16 }}>🔒</Text>
              <InfoText>
                {t('settings.backup.securityNotice', {
                  defaultValue: 'Seus dados são salvos com segurança diretamente na sua conta Google (pasta privada de aplicativo). O Tudu não possui servidores próprios nem acessa seus arquivos pessoais.',
                })}
              </InfoText>
            </InfoBadge>
          </Section>
        </Container>
      </PageContent>

      {/* Restore Preview Modal */}
      <BackupPreviewModal
        visible={!!previewData}
        preview={previewData}
        onConfirmRestore={handleConfirmRestore}
        onCancel={() => setPreviewData(null)}
        isLoading={isRestoring}
      />
    </Page>
  );
};
