import React, { memo, useCallback } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { BlurredModal } from '../blurred-modal';
import { GradientSeparator } from '../gradient-separator';
import { ShrinkableView } from '../shrinkable-view';
import { Section } from '../../scenes/home/types';

const ModalBox = styled.View`
  width: 88%;
  max-width: 360px;
  background-color: ${({ theme }) => theme.colors.popupBackground};
  border-radius: 20px;
  padding: 20px 18px 18px 18px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.4;
  shadow-radius: 16px;
  elevation: 12;
`;

const TitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 4px;
`;

const MessageText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 18px;
  margin-top: 12px;
  margin-bottom: 14px;
`;

const ActionsColumn = styled.View`
  gap: 8px;
  margin-top: 4px;
`;

const ActionOption = styled(ShrinkableView)<{ isDestructive?: boolean }>`
  padding-vertical: 12px;
  padding-horizontal: 14px;
  border-radius: 12px;
  background-color: ${({ isDestructive }) =>
    isDestructive ? 'rgba(255, 77, 79, 0.15)' : 'rgba(255, 255, 255, 0.07)'};
  border-width: 1px;
  border-color: ${({ isDestructive }) =>
    isDestructive ? 'rgba(255, 77, 79, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
`;

const ActionText = styled.Text<{ isDestructive?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ isDestructive, theme }) =>
    isDestructive ? '#FF7875' : theme.colors.contrastColor};
`;

const CancelRow = styled.View`
  margin-top: 10px;
  align-items: center;
`;

const CancelBtn = styled(ShrinkableView)`
  padding-vertical: 8px;
  padding-horizontal: 16px;
`;

const CancelText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: #a0aab8;
`;

interface SectionDeleteModalProps {
  visible: boolean;
  section?: Section;
  itemCount: number;
  onConfirm: (deleteItems: boolean) => void;
  onRequestClose: () => void;
}

export const SectionDeleteModal: React.FC<SectionDeleteModalProps> = memo(
  ({ visible, section, itemCount, onConfirm, onRequestClose }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const handleKeepItems = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      onConfirm(false);
      onRequestClose();
    }, [onConfirm, onRequestClose]);

    const handleDeleteItems = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('notificationWarning');
      onConfirm(true);
      onRequestClose();
    }, [onConfirm, onRequestClose]);

    if (!section) return null;

    return (
      <BlurredModal
        visible={visible}
        transparent
        onTouchBackground={onRequestClose}
        onRequestClose={onRequestClose}>
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(150)}
            style={{ width: '100%', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <ModalBox>
                <TitleText>
                  {t('sections.deleteConfirmTitle', {
                    name: section.title,
                    defaultValue: `Excluir seção '${section.title}'?`,
                  })}
                </TitleText>

                <GradientSeparator
                  colorArray={theme.colors.defaultSeparatorGradientColors}
                  marginTop={4}
                />

                <MessageText>
                  {t('sections.deleteConfirmMsg', {
                    defaultValue:
                      'O que você deseja fazer com os itens desta seção?',
                  })}
                </MessageText>

                <ActionsColumn>
                  <ActionOption onPress={handleKeepItems}>
                    <ActionText>
                      {t('sections.keepItems', {
                        defaultValue: 'Manter itens (mover para início)',
                      })}
                    </ActionText>
                  </ActionOption>

                  {itemCount > 0 && (
                    <ActionOption isDestructive onPress={handleDeleteItems}>
                      <ActionText isDestructive>
                        {t('sections.deleteItems', {
                          defaultValue: `Excluir seção e seus ${itemCount} itens`,
                        })}
                      </ActionText>
                    </ActionOption>
                  )}
                </ActionsColumn>

                <CancelRow>
                  <CancelBtn onPress={onRequestClose}>
                    <CancelText>
                      {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                    </CancelText>
                  </CancelBtn>
                </CancelRow>
              </ModalBox>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </BlurredModal>
    );
  },
);
