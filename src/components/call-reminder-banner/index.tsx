import React, { memo } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCallReminderBanner } from '../../service/notification/hooks/useCallReminderBanner';
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
  SecondaryAction,
  SecondaryActionText,
  TitleGroup,
  TopRow,
} from './styles';
import { CallReminderBannerProps } from './types';

export const CallReminderBanner: React.FC<CallReminderBannerProps> = memo(
  () => {
    const { t } = useTranslation();
    const { shouldShow, isLoading, enableCallReminders, dismissBanner } =
      useCallReminderBanner();

    if (!shouldShow) {
      return null;
    }

    return (
      <BannerWrapper>
        <BannerContainer>
          <TopRow>
            <TitleGroup>
              <IconContainer>
                <Text style={{ fontSize: 16 }}>📞</Text>
              </IconContainer>
              <BannerTitle>
                {t('settings.notifications.callReminder.bannerTitle', {
                  defaultValue: 'Lembrete por Ligação',
                })}
              </BannerTitle>
            </TitleGroup>
            <DismissButton onPress={dismissBanner}>
              <DismissButtonText>✕</DismissButtonText>
            </DismissButton>
          </TopRow>

          <BannerMessage>
            {t('settings.notifications.callReminder.bannerDescription', {
              defaultValue:
                'Receba chamadas em tela cheia com voz para não perder suas tarefas com horário marcado.',
            })}
          </BannerMessage>

          <ActionRow>
            <SecondaryAction onPress={dismissBanner}>
              <SecondaryActionText>
                {t('settings.notifications.callReminder.bannerDismissButton', {
                  defaultValue: 'Agora não',
                })}
              </SecondaryActionText>
            </SecondaryAction>
            <PrimaryAction onPress={enableCallReminders} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <PrimaryActionText>
                  {t('settings.notifications.callReminder.bannerEnableButton', {
                    defaultValue: 'Ativar',
                  })}
                </PrimaryActionText>
              )}
            </PrimaryAction>
          </ActionRow>
        </BannerContainer>
      </BannerWrapper>
    );
  },
);

export * from './types';
