import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { hasSeenSubscriptionReminderState } from '../../state/atoms';
import { hasSeenOnboarding as hasSeenOnboardingState } from '../../state/onboarding';
import { useSubscription } from '../../service/subscription/useSubscription';
import { SubscriptionReminderModalProps } from './types';
import {
  CloseButton,
  CloseButtonText,
  FeatureDescription,
  FeatureIconBox,
  FeatureIconText,
  FeatureItem,
  FeaturesList,
  FeatureTextContainer,
  FeatureTitle,
  HeaderRow,
  ModalContainer,
  Overlay,
  PriceHighlight,
  PriceRow,
  PriceSubtext,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  Subtitle,
  Title,
  TrialBadge,
  TrialBadgeText,
} from './styles';

export const SubscriptionReminderModal: React.FC<SubscriptionReminderModalProps> = ({
  onNavigateToSubscription,
}) => {
  const { t } = useTranslation();
  const [hasSeenReminder, setHasSeenReminder] = useRecoilState(
    hasSeenSubscriptionReminderState,
  );
  const hasSeenOnboarding = useRecoilValue(hasSeenOnboardingState);
  const { isPro, priceFormatted } = useSubscription();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenReminder && !isPro && hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenReminder, isPro, hasSeenOnboarding]);

  const handleDismiss = useCallback(() => {
    setHasSeenReminder(true);
    setVisible(false);
  }, [setHasSeenReminder]);

  const handleAction = useCallback(() => {
    setHasSeenReminder(true);
    setVisible(false);
    onNavigateToSubscription?.();
  }, [setHasSeenReminder, onNavigateToSubscription]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}>
      <Overlay>
        <ModalContainer>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <HeaderRow>
              <TrialBadge>
                <TrialBadgeText>
                  {t('settings.subscription.reminder.badge', {
                    defaultValue: '7 Dias Grátis',
                  })}
                </TrialBadgeText>
              </TrialBadge>
              <CloseButton onPress={handleDismiss} activeOpacity={0.7}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </HeaderRow>

            <Title>
              {t('settings.subscription.reminder.title', {
                defaultValue: 'Experimente o Tudú Pro ⚡',
              })}
            </Title>

            <PriceRow>
              <PriceHighlight>
                {priceFormatted || t('subscription.viewInStore', { defaultValue: '7 Dias Grátis' })}
              </PriceHighlight>
              <PriceSubtext>
                {t('settings.subscription.priceSubtext', {
                  defaultValue: 'após a 1ª semana grátis',
                })}
              </PriceSubtext>
            </PriceRow>

            <Subtitle>
              {t('settings.subscription.reminder.subtitle', {
                defaultValue:
                  'Desbloqueie IA nativa sem chaves, sincronização contínua na nuvem e backup automático sem nenhum custo por uma semana inteira.',
              })}
            </Subtitle>

            <FeaturesList>
              <FeatureItem>
                <FeatureIconBox>
                  <FeatureIconText>🧠</FeatureIconText>
                </FeatureIconBox>
                <FeatureTextContainer>
                  <FeatureTitle>
                    {t('settings.subscription.reminder.feat1Title', {
                      defaultValue: 'IA Nativa Integrada',
                    })}
                  </FeatureTitle>
                  <FeatureDescription>
                    {t('settings.subscription.reminder.feat1Desc', {
                      defaultValue:
                        'Sugestões inteligentes de tarefas e emojis sem complicação de API Keys.',
                    })}
                  </FeatureDescription>
                </FeatureTextContainer>
              </FeatureItem>

              <FeatureItem>
                <FeatureIconBox>
                  <FeatureIconText>☁️</FeatureIconText>
                </FeatureIconBox>
                <FeatureTextContainer>
                  <FeatureTitle>
                    {t('settings.subscription.reminder.feat2Title', {
                      defaultValue: 'Sincronização em Nuvem',
                    })}
                  </FeatureTitle>
                  <FeatureDescription>
                    {t('settings.subscription.reminder.feat2Desc', {
                      defaultValue:
                        'Suas tarefas e contadores salvos com segurança em tempo real.',
                    })}
                  </FeatureDescription>
                </FeatureTextContainer>
              </FeatureItem>

              <FeatureItem>
                <FeatureIconBox>
                  <FeatureIconText>📱</FeatureIconText>
                </FeatureIconBox>
                <FeatureTextContainer>
                  <FeatureTitle>
                    {t('settings.subscription.reminder.feat3Title', {
                      defaultValue: 'Backup & Multi-Aparelhos',
                    })}
                  </FeatureTitle>
                  <FeatureDescription>
                    {t('settings.subscription.reminder.feat3Desc', {
                      defaultValue:
                        'Troque de aparelho ou recupere seus dados a qualquer momento.',
                    })}
                  </FeatureDescription>
                </FeatureTextContainer>
              </FeatureItem>
            </FeaturesList>

            <PrimaryButton onPress={handleAction}>
              <PrimaryButtonText>
                {t('settings.subscription.reminder.tryButton', {
                  defaultValue: 'Experimentar 7 Dias Grátis',
                })}
              </PrimaryButtonText>
            </PrimaryButton>

            <SecondaryButton onPress={handleDismiss} activeOpacity={0.7}>
              <SecondaryButtonText>
                {t('settings.subscription.reminder.dismissButton', {
                  defaultValue: 'Agora não',
                })}
              </SecondaryButtonText>
            </SecondaryButton>
          </ScrollView>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};
