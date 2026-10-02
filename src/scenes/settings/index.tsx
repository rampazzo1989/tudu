import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Alert, Text} from 'react-native';
import {useRecoilValue} from 'recoil';
import Toast from 'react-native-toast-message';
import {SettingsIcon} from '../../components/animated-icons/settings-icon';
import {DefaultHeader} from '../../components/default-header';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {aiSettingsState, backupSettingsState, notificationSettingsState, securitySettingsState} from '../../state/atoms';
import {useSubscription} from '../../service/subscription/useSubscription';
import {useAuth} from '../../service/auth/useAuth';
import {useAITokenUsage} from '../../service/ai';
import {useImportListService} from '../../service/list-sharing';
import {ImportListModal} from '../../components/import-list-modal';
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
  ProSettingsCard,
  ProIconContainer,
  ProBadge,
  ProBadgeText,
  ProChevron,
  AccountCard,
  AccountHeader,
  AccountUserRow,
  AccountAvatarImage,
  AccountAvatarFallback,
  AccountAvatarFallbackText,
  AccountInfoCol,
  AccountNameText,
  AccountEmailText,
  AccountBadgeRow,
  AccountSyncTag,
  AccountSyncText,
  AccountSignOutButton,
  AccountSignOutButtonText,
  AccountConnectButton,
  AccountConnectButtonText,
} from './styles';
import {styles} from '../home/styles';
import {SettingsPageProps} from './types';

const SettingsPage: React.FC<SettingsPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {isPro, status: subscriptionStatus} = useSubscription();
  const {user, signInWithGoogle, signOut, loading: authLoading} = useAuth();
  const aiSettings = useRecoilValue(aiSettingsState);
  const notificationSettings = useRecoilValue(notificationSettingsState);
  const backupSettings = useRecoilValue(backupSettingsState);
  const securitySettings = useRecoilValue(securitySettingsState);
  const {monthlyStats} = useAITokenUsage();
  const {
    previewData,
    isImporting,
    pickAndPreviewTuduFile,
    confirmImport,
    cancelImport,
  } = useImportListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubscriptionPress = useCallback(() => {
    navigation.navigate('SubscriptionSettings');
  }, [navigation]);

  const handleSecuritySettingsPress = useCallback(() => {
    navigation.navigate('SecuritySettings');
  }, [navigation]);

  const handleAISettingsPress = useCallback(() => {
    navigation.navigate('AISettings');
  }, [navigation]);

  const handleAIUsagePress = useCallback(() => {
    if (isPro) return;
    navigation.navigate('AIUsage');
  }, [isPro, navigation]);

  const handleNotificationSettingsPress = useCallback(() => {
    navigation.navigate('NotificationSettings');
  }, [navigation]);

  const handleBackupSettingsPress = useCallback(() => {
    navigation.navigate('BackupSettings');
  }, [navigation]);

  const handleConnectGoogle = useCallback(async () => {
    try {
      await signInWithGoogle();
      Toast.show({
        type: 'success',
        text1: t('settings.account.connectSuccessTitle', { defaultValue: 'Conta Conectada!' }),
        text2: t('settings.account.connectSuccessMsg', {
          defaultValue: 'Sua conta foi vinculada ao Tudú Pro e ao Google Drive.',
        }),
      });
    } catch (err: any) {
      if (err?.message !== 'Login cancelado pelo usuário.') {
        Toast.show({
          type: 'error',
          text1: t('settings.account.connectErrorTitle', { defaultValue: 'Falha na Conexão' }),
          text2: err?.message || t('settings.account.connectErrorMsg', { defaultValue: 'Não foi possível conectar com o Google.' }),
        });
      }
    }
  }, [signInWithGoogle, t]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('settings.account.signOutTitle', { defaultValue: 'Desconectar Conta' }),
      t('settings.account.signOutConfirm', {
        defaultValue: 'Deseja realmente sair da sua Conta Tudú Pro? O backup automático e a sincronização em nuvem serão pausados.',
      }),
      [
        { text: t('buttons.cancel', { defaultValue: 'Cancelar' }), style: 'cancel' },
        {
          text: t('buttons.yes', { defaultValue: 'Sair' }),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            Toast.show({
              type: 'info',
              text1: t('settings.account.signOutSuccess', { defaultValue: 'Conta desconectada com sucesso.' }),
            });
          },
        },
      ],
    );
  }, [signOut, t]);


  const getProviderName = (providerKey: string) => {
    return t(`settings.ai.providers.${providerKey}`, {
      defaultValue: providerKey,
    });
  };

  const isAIActive = isPro || aiSettings.hasApiKey;
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

  const isSecurityActive = securitySettings.isLockEnabled;

  const getSecurityStatusText = () => {
    if (securitySettings.isLockEnabled) {
      if (securitySettings.isBiometricsEnabled) {
        return t('settings.security.statusPinBiometrics', {
          defaultValue: 'PIN + Biometria',
        });
      }
      return t('settings.security.statusPinOnly', {
        defaultValue: 'PIN Ativo',
      });
    }
    return t('settings.security.statusDisabled', {
      defaultValue: 'Desativado',
    });
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
          {/* Subscription Section (Highlighted) */}
          <SectionContainer>
            <SectionTitleText>
              {t('settings.subscription.sectionTitle', {
                defaultValue: 'Assinatura',
              })}
            </SectionTitleText>
            <ProSettingsCard onPress={handleSubscriptionPress} isPro={isPro}>
              <CardLeftContent>
                <ProIconContainer isPro={isPro}>
                  <Text style={{fontSize: 22}}>⚡</Text>
                </ProIconContainer>
                <CardTextContainer>
                  <CardTitle>
                    {t('settings.subscription.cardTitle', {
                      defaultValue: 'Tudú Pro',
                    })}
                  </CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {isPro
                      ? t('settings.subscription.cardSubtitlePro', {
                          defaultValue:
                            'Assinatura ativa. Recursos de IA e nuvem liberados.',
                        })
                      : t('settings.subscription.cardSubtitleFree', {
                          defaultValue:
                            'IA integrada sem chaves, nuvem e backup automático. Teste 7 dias grátis!',
                        })}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <ProBadge
                type={
                  isPro
                    ? subscriptionStatus === 'TRIALING'
                      ? 'trial'
                      : 'active'
                    : 'free'
                }>
                <ProBadgeText
                  type={
                    isPro
                      ? subscriptionStatus === 'TRIALING'
                        ? 'trial'
                        : 'active'
                      : 'free'
                  }>
                  {isPro
                    ? subscriptionStatus === 'TRIALING'
                      ? t('settings.subscription.badgeTrial', {
                          defaultValue: 'TESTE ATIVO',
                        })
                      : t('settings.subscription.badgePro', {
                          defaultValue: 'PRO ATIVO',
                        })
                    : t('settings.subscription.badgeFree', {
                        defaultValue: '7 DIAS GRÁTIS',
                      })}
                </ProBadgeText>
              </ProBadge>
              <ProChevron>›</ProChevron>
            </ProSettingsCard>
          </SectionContainer>

          {/* Minha Conta Section (Exclusivo Tudú Pro) */}
          {isPro && (
            <SectionContainer>
              <SectionTitleText>
                {t('settings.account.sectionTitle', { defaultValue: 'Minha Conta' })}
              </SectionTitleText>
              <AccountCard>
                {user ? (
                  <>
                    <AccountHeader>
                      <AccountUserRow>
                        {user.avatarUrl ? (
                          <AccountAvatarImage source={{ uri: user.avatarUrl }} />
                        ) : (
                          <AccountAvatarFallback>
                            <AccountAvatarFallbackText>
                              {user.name
                                ? user.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase()
                                : 'U'}
                            </AccountAvatarFallbackText>
                          </AccountAvatarFallback>
                        )}
                        <AccountInfoCol>
                          <AccountNameText numberOfLines={1}>
                            {user.name || t('settings.account.defaultUserName', { defaultValue: 'Usuário Tudú Pro' })}
                          </AccountNameText>
                          <AccountEmailText numberOfLines={1}>{user.email}</AccountEmailText>
                        </AccountInfoCol>
                      </AccountUserRow>
                      <AccountSignOutButton onPress={handleSignOut} disabled={authLoading}>
                        <AccountSignOutButtonText>
                          {t('settings.account.signOut', { defaultValue: 'Sair' })}
                        </AccountSignOutButtonText>
                      </AccountSignOutButton>
                    </AccountHeader>

                    <AccountBadgeRow>
                      <AccountSyncTag>
                        <Text style={{ fontSize: 14, marginRight: 6 }}>☁️</Text>
                        <AccountSyncText>
                          {t('settings.account.syncAndBackupActive', { defaultValue: 'Nuvem e Backup Integrados' })}
                        </AccountSyncText>
                      </AccountSyncTag>
                      <ProBadge type={subscriptionStatus === 'TRIALING' ? 'trial' : 'active'}>
                        <ProBadgeText type={subscriptionStatus === 'TRIALING' ? 'trial' : 'active'}>
                          {subscriptionStatus === 'TRIALING' ? 'TESTE PRO' : 'TUDÚ PRO'}
                        </ProBadgeText>
                      </ProBadge>
                    </AccountBadgeRow>
                  </>
                ) : (
                  <>
                    <CardTextContainer style={{ marginBottom: 10 }}>
                      <CardTitle>
                        {t('settings.account.connectTitle', { defaultValue: 'Vincular Conta Google' })}
                      </CardTitle>
                      <CardSubtitle>
                        {t('settings.account.connectSubtitle', {
                          defaultValue: 'Conecte sua conta para sincronização em nuvem e backup automático no Google Drive.',
                        })}
                      </CardSubtitle>
                    </CardTextContainer>
                    <AccountConnectButton onPress={handleConnectGoogle} disabled={authLoading}>
                      {authLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={{ fontSize: 18 }}>🇬</Text>
                          <AccountConnectButtonText>
                            {t('settings.account.connectButton', { defaultValue: 'Conectar com o Google' })}
                          </AccountConnectButtonText>
                        </>
                      )}
                    </AccountConnectButton>
                  </>
                )}
              </AccountCard>
            </SectionContainer>
          )}

          {/* Security & Lock Section */}
          <SectionContainer>
            <SectionTitleText>
              {t('settings.security.sectionTitle', {
                defaultValue: 'Segurança & Privacidade',
              })}
            </SectionTitleText>
            <SettingsCard onPress={handleSecuritySettingsPress}>
              <CardLeftContent>
                <IconContainer>
                  <Text style={{fontSize: 22}}>🔒</Text>
                </IconContainer>
                <CardTextContainer>
                  <CardTitle>
                    {t('settings.security.title', {
                      defaultValue: 'Segurança e Bloqueio',
                    })}
                  </CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {t('settings.security.subtitle', {
                      defaultValue:
                        'Bloquear aplicativo com senha (PIN) e biometria',
                    })}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={isSecurityActive}>
                <StatusText active={isSecurityActive}>
                  {getSecurityStatusText()}
                </StatusText>
              </StatusBadge>
            </SettingsCard>
          </SectionContainer>

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

            <SettingsCard onPress={pickAndPreviewTuduFile} style={{marginTop: 8}}>
              <CardLeftContent>
                <IconContainer>
                  <Text style={{fontSize: 22}}>📥</Text>
                </IconContainer>
                <CardTextContainer>
                  <CardTitle>
                    {t('settings.importList.title', { defaultValue: 'Importar Lista' })}
                  </CardTitle>
                  <CardSubtitle numberOfLines={2}>
                    {t('settings.importList.subtitle', {
                      defaultValue: 'Importar lista a partir de um arquivo .tudu compartilhado',
                    })}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={false}>
                <StatusText active={false}>
                  .tudu
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
                    {isPro
                      ? t('settings.ai.managedModeDescription', {
                          defaultValue:
                            'IA integrada pronta para uso, sem necessidade de chaves de API. Backup e sincronização em nuvem inclusos.',
                        })
                      : t('settings.ai.subtitle')}
                  </CardSubtitle>
                </CardTextContainer>
              </CardLeftContent>
              <StatusBadge active={isAIActive}>
                <StatusText active={isAIActive}>
                  {isPro
                    ? t('settings.ai.proActive', {defaultValue: 'Tudú Pro Ativo'})
                    : isAIActive
                      ? t('settings.ai.statusActive', {
                          provider: getProviderName(aiSettings.provider),
                        })
                      : t('settings.ai.statusNotConfigured')}
                </StatusText>
              </StatusBadge>
            </SettingsCard>

            {!isPro && (
              <SettingsCard onPress={handleAIUsagePress} style={{marginTop: 8}}>
                <CardLeftContent>
                  <IconContainer>
                    <Text style={{fontSize: 22}}>📊</Text>
                  </IconContainer>
                  <CardTextContainer>
                    <CardTitle>{t('settings.ai.usage.title', {defaultValue: 'Consumo de Tokens'})}</CardTitle>
                    <CardSubtitle numberOfLines={2}>
                      {monthlyStats.totalTokens > 0
                        ? t('settings.ai.usage.cardSubtitle', {
                            tokens: monthlyStats.totalTokens.toLocaleString(),
                            defaultValue: `${monthlyStats.totalTokens.toLocaleString()} tokens consumidos este mês`,
                          })
                        : t('settings.ai.usage.cardSubtitleEmpty', {
                            defaultValue: 'Veja o relatório detalhado de tokens',
                          })}
                    </CardSubtitle>
                  </CardTextContainer>
                </CardLeftContent>
                <StatusBadge active={monthlyStats.totalTokens > 0}>
                  <StatusText active={monthlyStats.totalTokens > 0}>
                    {monthlyStats.totalTokens > 0
                      ? `${monthlyStats.totalTokens.toLocaleString()} tokens`
                      : t('settings.ai.usage.periods.month', {defaultValue: 'Este mês'})}
                  </StatusText>
                </StatusBadge>
              </SettingsCard>
            )}
          </SectionContainer>

        </Container>
      </PageContent>
      <ImportListModal
        visible={!!previewData}
        preview={previewData}
        onConfirmImport={confirmImport}
        onCancel={cancelImport}
        isLoading={isImporting}
      />
    </Page>
  );
};


export {SettingsPage};

