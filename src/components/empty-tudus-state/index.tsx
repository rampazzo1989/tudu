import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { EmptyTudusStateProps } from './types';
import {
  ButtonsRow,
  CardTouchWrapper,
  Container,
  IconBadge,
  IconText,
  PrimaryAddButton,
  PrimaryAddButtonText,
  SecondaryAIButton,
  SecondaryAIButtonText,
  SubtitleText,
  TitleText,
} from './styles';

export const EmptyTudusState: React.FC<EmptyTudusStateProps> = memo(
  ({ onAddPress, onAISuggestionsPress, isSmartList = false }) => {
    const { t } = useTranslation();

    const handleAddPress = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      onAddPress?.();
    }, [onAddPress]);

    const handleAIPress = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      onAISuggestionsPress?.();
    }, [onAISuggestionsPress]);

    return (
      <Container>
        <Animated.View
          entering={FadeInDown.duration(350)}
          style={{ width: '100%', alignItems: 'center' }}>
          <CardTouchWrapper
            activeOpacity={0.85}
            onPress={handleAddPress}>
            <IconBadge>
              <IconText>📝</IconText>
            </IconBadge>

            <TitleText>
              {t('emptyStates.emptyList.title', {
                defaultValue: 'Sua lista está vazia',
              })}
            </TitleText>

            <SubtitleText>
              {t('emptyStates.emptyList.subtitle', {
                defaultValue:
                  'Adicione o primeiro tudú para começar ou use a IA para sugerir tarefas.',
              })}
            </SubtitleText>

            <ButtonsRow>
              {onAddPress && (
                <PrimaryAddButton onPress={handleAddPress}>
                  <PrimaryAddButtonText>
                    {t('emptyStates.emptyList.button', {
                      defaultValue: '+ Adicionar tudú',
                    })}
                  </PrimaryAddButtonText>
                </PrimaryAddButton>
              )}

              {onAISuggestionsPress && !isSmartList && (
                <SecondaryAIButton onPress={handleAIPress}>
                  <SecondaryAIButtonText>
                    {t('emptyStates.emptyList.buttonAI', {
                      defaultValue: '✨ Sugerir com IA',
                    })}
                  </SecondaryAIButtonText>
                </SecondaryAIButton>
              )}
            </ButtonsRow>
          </CardTouchWrapper>
        </Animated.View>
      </Container>
    );
  },
);
