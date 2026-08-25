import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { EmptyListsCardProps } from './types';
import {
  CardContainer,
  CreateButton,
  CreateButtonText,
  IconBadge,
  IconText,
  SubtitleText,
  TitleText,
} from './styles';

export const EmptyListsCard: React.FC<EmptyListsCardProps> = memo(
  ({ onCreateList }) => {
    const { t } = useTranslation();

    const handlePress = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      onCreateList();
    }, [onCreateList]);

    return (
      <CardContainer activeOpacity={0.8} onPress={handlePress}>
        <IconBadge>
          <IconText>📋</IconText>
        </IconBadge>

        <TitleText>
          {t('emptyStates.myLists.title', {
            defaultValue: 'Nenhuma lista criada ainda',
          })}
        </TitleText>

        <SubtitleText>
          {t('emptyStates.myLists.subtitle', {
            defaultValue:
              'Crie listas personalizadas para organizar suas tarefas ou importe textos usando IA.',
          })}
        </SubtitleText>

        <CreateButton onPress={handlePress}>
          <CreateButtonText>
            {t('emptyStates.myLists.button', {
              defaultValue: '+ Criar nova lista',
            })}
          </CreateButtonText>
        </CreateButton>
      </CardContainer>
    );
  },
);
