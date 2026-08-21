import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native';
import {useRecoilValue} from 'recoil';
import {SettingsIcon} from '../../components/animated-icons/settings-icon';
import {DefaultHeader} from '../../components/default-header';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {aiSettingsState, backupSettingsState, notificationSettingsState} from '../../state/atoms';
import {
  Container,
  SectionContainer,
  SectionTitleText,
  SettingsCard,
  CardLeftContent,
  IconContainer,
  CardTextContainer,
  CardTitle,
  CardSubtitle,
  StatusBadge,
  StatusText,
} from './styles';
import {styles} from '../home/styles';
import {SettingsPageProps} from './types';

const SettingsPage: React.FC<SettingsPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const aiSettings = useRecoilValue(aiSettingsState);
  const notificationSettings = useRecoilValue(notificationSettingsState);
  const backupSettings = useRecoilValue(backupSettingsState);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAISettingsPress = useCallback(() => {
    navigation.navigate('AISettings');
  }, [navigation]);

  const handleNotificationSettingsPress = useCallback(() => {
    navigation.navigate('NotificationSettings');
  }, [navigation]);

  const handleBackupSettingsPress = useCallback(() => {
    navigation.navigate('BackupSettings');
  }, [navigation]);

  const getProviderName = (providerKey: string) => {
    return t(`settings.ai.providers.${providerKey}`, {
      defaultValue: providerKey,
    });
  };

  const isAIActive = aiSettings.hasApiKey;
  const isNotificationActive =
    notificationSettings.timedNotificationsEnabled ||
    notificationSettings.dailyDigestEnabled;
  const isBackupActive = !!backupSettings.googleUser || !!backupSettings.lastLocalBackupDate;

  const formattedDigestTime = `${String(
    notificationSettings.dailyDigestHour,
  ).padStart(2, '0')}:${String(
    notificationSettings.dailyDigestMinute,
  ).padStart(2, '0')}`;

  const getNotificationStatusText = () => {
    if (notificationSettings.dailyDigestEnabled) {
      return t('settings.notifications.statusDigestTime', {
        time: formattedDigestTime,
      });
    }
    if (notificationSettings.timedNotificationsEnabled) {
      return t('settings.notifications.statusActive');
    }
    return t('settings.notifications.statusDisabled');
  };

  const getBackupStatusText = () => {
    if (backupSettings.googleUser) {
      if (backupSettings.autoBackupEnabled) {
        return t('settings.backup.statusAutoActive', { defaultValue: 'Nuvem (Auto)' });
      }
      return t('settings.backup.statusConnected', { defaultValue: 'Google Drive' });
    }
    if (backupSettings.lastLocalBackupDate) {
      return t('settings.backup.statusLocal', { defaultValue: 'Arquivo Local' });
    }
    return t('settings.backup.statusNotConfigured', { defaultValue: 'Não configurado' });
  };

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.title')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <Container>
          {/* Backup & Restore Section */}
          <SectionContainer>
            <SectionTitleText>
              {t('settings.backup.sectionTitle', { defaultValue: 'Backup e Restauração' })}
            </SectionTitleText>
            <SettingsCard onPress={handleBackupSettingsPress}>
              <CardLeftContent>
                <IconContainer>
                  <Text style={{fontSize: 22}}>☁️</Text>
                </IconContainer>
                <CardTextContainer>
                  <CardTitle>{t('settings.backup.title', { defaultValue: 'Backup & Restauração' })}</CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {t('settings.backup.subtitle', {
                      defaultValue: 'Backup automático e manual no Google Drive ou arquivo local',
                    })}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={isBackupActive}>
                <StatusText active={isBackupActive}>
                  {getBackupStatusText()}
                </StatusText>
              </StatusBadge>
            </SettingsCard>
          </SectionContainer>

          {/* Notifications Section */}
          <SectionContainer>
            <SectionTitleText>
              {t('settings.notifications.title')}
            </SectionTitleText>
            <SettingsCard onPress={handleNotificationSettingsPress}>
              <CardLeftContent>
                <IconContainer>
                  <Text style={{fontSize: 22}}>🔔</Text>
                </IconContainer>
                <CardTextContainer>
                  <CardTitle>{t('settings.notifications.title')}</CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {t('settings.notifications.subtitle')}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={isNotificationActive}>
                <StatusText active={isNotificationActive}>
                  {getNotificationStatusText()}
                </StatusText>
              </StatusBadge>
            </SettingsCard>
          </SectionContainer>

          {/* AI Section */}
          <SectionContainer>
            <SectionTitleText>{t('settings.sections.ai')}</SectionTitleText>
            <SettingsCard onPress={handleAISettingsPress}>
              <CardLeftContent>
                <IconContainer>
                  <Text style={{fontSize: 22}}>✨</Text>
                </IconContainer>
                <CardTextContainer>
                  <CardTitle>{t('settings.ai.title')}</CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {t('settings.ai.subtitle')}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={isAIActive}>
                <StatusText active={isAIActive}>
                  {isAIActive
                    ? t('settings.ai.statusActive', {
                        provider: getProviderName(aiSettings.provider),
                      })
                    : t('settings.ai.statusNotConfigured')}
                </StatusText>
              </StatusBadge>
            </SettingsCard>
          </SectionContainer>
        </Container>
      </PageContent>
    </Page>
  );
};


export {SettingsPage};

