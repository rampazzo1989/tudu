import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Switch, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import { SettingsIcon } from '../../../components/animated-icons/settings-icon';
import { DefaultHeader } from '../../../components/default-header';
import { Page } from '../../../components/page';
import { PageContent } from '../../../components/page-content';
import { PinModal } from '../../../components/pin-modal';
import { PinModalMode } from '../../../components/pin-modal/types';
import { useSecurityService } from '../../../service/security';
import { LockTimeoutOption } from '../../../state/atoms';
import { styles } from '../../home/styles';
import {
  ActionArrow,
  ActionCard,
  ActionCardIcon,
  ActionCardLeft,
  ActionCardSubtitle,
  ActionCardTextContainer,
  ActionCardTitle,
  Card,
  Container,
  EmojiIcon,
  InfoBadge,
  InfoText,
  Section,
  SectionTitle,
  TimeoutChip,
  TimeoutChipText,
  TimeoutOptionsContainer,
  ToggleCard,
  ToggleDescription,
  ToggleTextContainer,
  ToggleTitle,
} from './styles';
import { SecuritySettingsPageProps } from './types';

const TIMEOUT_OPTIONS: { key: LockTimeoutOption; labelKey: string }[] = [
  { key: 'immediate', labelKey: 'settings.security.timeouts.immediate' },
  { key: '1m', labelKey: 'settings.security.timeouts.1m' },
  { key: '5m', labelKey: 'settings.security.timeouts.5m' },
  { key: '15m', labelKey: 'settings.security.timeouts.15m' },
];

export const SecuritySettingsPage: React.FC<SecuritySettingsPageProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    settings,
    sensorInfo,
    refreshSensorInfo,
    setupPin,
    changePin,
    disableLock,
    toggleBiometrics,
    setLockTimeout,
  } = useSecurityService();

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<PinModalMode>('setup');

  useFocusEffect(
    useCallback(() => {
      refreshSensorInfo();
    }, [refreshSensorInfo]),
  );

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleLock = useCallback(
    (value: boolean) => {
      if (value) {
        // User wants to enable lock -> open setup modal
        setPinModalMode('setup');
        setPinModalVisible(true);
      } else {
        // User wants to disable lock -> open disable modal to verify current pin
        setPinModalMode('disable');
        setPinModalVisible(true);
      }
    },
    [],
  );

  const handleChangePinPress = useCallback(() => {
    setPinModalMode('change');
    setPinModalVisible(true);
  }, []);

  const handlePinModalSuccess = useCallback(
    (pin?: string) => {
      if (pinModalMode === 'setup' && pin) {
        setupPin(pin, sensorInfo.available);
        Toast.show({
          type: 'success',
          text1: t('settings.security.pinSetupSuccess', {
            defaultValue: 'Bloqueio por PIN ativado com sucesso!',
          }),
        });
      } else if (pinModalMode === 'change' && pin) {
        // changePin was handled or confirmed
        // Since setupPin / changePin are called, we can set up the new pin directly
        setupPin(pin);
        Toast.show({
          type: 'success',
          text1: t('settings.security.pinChangeSuccess', {
            defaultValue: 'PIN alterado com sucesso!',
          }),
        });
      } else if (pinModalMode === 'disable') {
        if (settings.pinHash) {
          // Disabled successfully
          if (pin) {
            disableLock(pin);
          }
          Toast.show({
            type: 'info',
            text1: t('settings.security.lockDisabledSuccess', {
              defaultValue: 'Bloqueio do app desativado.',
            }),
          });
        }
      }
      setPinModalVisible(false);
    },
    [disableLock, pinModalMode, sensorInfo.available, settings.pinHash, setupPin, t],
  );

  const getBiometricsTitle = () => {
    if (sensorInfo.biometryType === 'FaceID') {
      return t('settings.security.biometricsFaceId', {
        defaultValue: 'Desbloqueio com Face ID',
      });
    }
    if (sensorInfo.biometryType === 'TouchID') {
      return t('settings.security.biometricsTouchId', {
        defaultValue: 'Desbloqueio com Touch ID',
      });
    }
    return t('settings.security.biometricsFingerprint', {
      defaultValue: 'Impressão Digital / Biometria',
    });
  };

  return (
    <Page>
      <DefaultHeader
        Icon={SettingsIcon}
        title={t('settings.security.title', {
          defaultValue: 'Segurança e Bloqueio',
        })}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <Container>
          {/* Main App Lock Activation */}
          <Section>
            <SectionTitle>
              {t('settings.security.sectionGeneral', {
                defaultValue: 'Proteção de Acesso',
              })}
            </SectionTitle>
            <ToggleCard>
              <ToggleTextContainer>
                <ToggleTitle>
                  {t('settings.security.enableLockTitle', {
                    defaultValue: 'Bloqueio do App',
                  })}
                </ToggleTitle>
                <ToggleDescription>
                  {t('settings.security.enableLockDesc', {
                    defaultValue:
                      'Exigir PIN ou biometria para abrir o Tudú',
                  })}
                </ToggleDescription>
              </ToggleTextContainer>
              <Switch
                value={settings.isLockEnabled}
                onValueChange={handleToggleLock}
                trackColor={{
                  false: theme.colors.counterIconBackground,
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </ToggleCard>
          </Section>

          {/* Options when lock is enabled */}
          {settings.isLockEnabled && (
            <>
              <Section>
                <SectionTitle>
                  {t('settings.security.sectionCredentials', {
                    defaultValue: 'Credenciais & Métodos',
                  })}
                </SectionTitle>

                {/* Change PIN */}
                <ActionCard onPress={handleChangePinPress} activeOpacity={0.7}>
                  <ActionCardLeft>
                    <ActionCardIcon>🔢</ActionCardIcon>
                    <ActionCardTextContainer>
                      <ActionCardTitle>
                        {t('settings.security.changePinTitle', {
                          defaultValue: 'Alterar PIN',
                        })}
                      </ActionCardTitle>
                      <ActionCardSubtitle>
                        {t('settings.security.changePinSubtitle', {
                          defaultValue: 'Redefina a senha numérica de 4 dígitos',
                        })}
                      </ActionCardSubtitle>
                    </ActionCardTextContainer>
                  </ActionCardLeft>
                  <ActionArrow>→</ActionArrow>
                </ActionCard>

                {/* Biometrics Toggle */}
                {sensorInfo.available && (
                  <ToggleCard>
                    <ToggleTextContainer>
                      <ToggleTitle>{getBiometricsTitle()}</ToggleTitle>
                      <ToggleDescription>
                        {t('settings.security.biometricsDesc', {
                          defaultValue:
                            'Usar sensor biométrico para desbloquear rapidamente sem digitar o PIN',
                        })}
                      </ToggleDescription>
                    </ToggleTextContainer>
                    <Switch
                      value={settings.isBiometricsEnabled}
                      onValueChange={toggleBiometrics}
                      trackColor={{
                        false: theme.colors.counterIconBackground,
                        true: theme.colors.primary,
                      }}
                      thumbColor="#FFFFFF"
                    />
                  </ToggleCard>
                )}
              </Section>

              {/* Lock Timeout Section */}
              <Section>
                <SectionTitle>
                  {t('settings.security.sectionTimeout', {
                    defaultValue: 'Bloqueio Automático',
                  })}
                </SectionTitle>
                <Card>
                  <ToggleTitle>
                    {t('settings.security.timeoutTitle', {
                      defaultValue: 'Tempo para Bloquear',
                    })}
                  </ToggleTitle>
                  <ToggleDescription>
                    {t('settings.security.timeoutDesc', {
                      defaultValue:
                        'Tempo em segundo plano antes de exigir nova autenticação',
                    })}
                  </ToggleDescription>
                  <TimeoutOptionsContainer>
                    {TIMEOUT_OPTIONS.map(opt => {
                      const isSelected = settings.lockTimeout === opt.key;
                      return (
                        <TimeoutChip
                          key={opt.key}
                          selected={isSelected}
                          onPress={() => setLockTimeout(opt.key)}
                          activeOpacity={0.7}>
                          <TimeoutChipText selected={isSelected}>
                            {t(opt.labelKey, {
                              defaultValue:
                                opt.key === 'immediate'
                                  ? 'Imediatamente'
                                  : opt.key,
                            })}
                          </TimeoutChipText>
                        </TimeoutChip>
                      );
                    })}
                  </TimeoutOptionsContainer>
                </Card>
              </Section>
            </>
          )}

          {/* Security Notice */}
          <Section>
            <InfoBadge>
              <EmojiIcon>🔒</EmojiIcon>
              <InfoText>
                {t('settings.security.securityNotice', {
                  defaultValue:
                    'Seu PIN é protegido com criptografia de hash seguro e armazenado exclusivamente no seu aparelho. O Tudú não tem acesso nem envia suas senhas para a internet.',
                })}
              </InfoText>
            </InfoBadge>
          </Section>
        </Container>
      </PageContent>

      <PinModal
        visible={pinModalVisible}
        mode={pinModalMode}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinModalSuccess}
      />
    </Page>
  );
};
