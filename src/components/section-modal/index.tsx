import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { BlurredModal } from '../blurred-modal';
import { GradientSeparator } from '../gradient-separator';
import { ShrinkableView } from '../shrinkable-view';

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

const ModalHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ModalTitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
`;

const CloseButton = styled(ShrinkableView)`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.08);
`;

const CloseText = styled.Text`
  font-size: 16px;
  color: #a0aab8;
  font-weight: 600;
`;

const InputContainer = styled.View`
  margin-top: 14px;
  margin-bottom: 6px;
`;

const SectionTextInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.contrastColor};
  background-color: rgba(255, 255, 255, 0.05);
  border-width: 1.5px;
  border-color: rgba(121, 86, 191, 0.4);
  border-radius: 12px;
  padding-vertical: 10px;
  padding-horizontal: 14px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`;

const CancelButton = styled(ShrinkableView)`
  padding-vertical: 12px;
  padding-horizontal: 18px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  align-items: center;
  justify-content: center;
`;

const CancelText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 14px;
  color: #a0aab8;
`;

const ConfirmButton = styled(ShrinkableView)<{ disabled?: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  border-radius: 12px;
  background-color: ${({ disabled, theme }) =>
    disabled ? '#585f69' : theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const ConfirmText = styled.Text<{ disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#a0aab8' : '#ffffff')};
  font-weight: 700;
`;

interface SectionModalProps {
  visible: boolean;
  initialTitle?: string;
  isEditing?: boolean;
  onSave: (title: string) => void;
  onRequestClose: () => void;
}

export const SectionModal: React.FC<SectionModalProps> = memo(
  ({ visible, initialTitle = '', isEditing = false, onSave, onRequestClose }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [title, setTitle] = useState(initialTitle);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (visible) {
        setTitle(initialTitle);
        setTimeout(() => inputRef.current?.focus(), 250);
      } else {
        setTitle('');
      }
    }, [visible, initialTitle]);

    const handleConfirm = useCallback(() => {
      const trimmed = title.trim();
      if (!trimmed) return;
      RNReactNativeHapticFeedback.trigger('impactLight');
      onSave(trimmed);
      onRequestClose();
    }, [title, onSave, onRequestClose]);

    return (
      <BlurredModal
        visible={visible}
        transparent
        onTouchBackground={onRequestClose}
        onRequestClose={onRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(150)}
            style={{ width: '100%', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <ModalBox>
                <ModalHeaderRow>
                  <ModalTitleText>
                    {isEditing
                      ? t('sections.renameSection', { defaultValue: 'Renomear Seção' })
                      : t('sections.newSection', { defaultValue: 'Nova Seção' })}
                  </ModalTitleText>
                  <CloseButton onPress={onRequestClose} hitSlop={12}>
                    <CloseText>×</CloseText>
                  </CloseButton>
                </ModalHeaderRow>

                <GradientSeparator
                  colorArray={theme.colors.defaultSeparatorGradientColors}
                  marginTop={4}
                />

                <InputContainer>
                  <SectionTextInput
                    ref={inputRef}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={t('sections.newSectionPlaceholder', {
                      defaultValue: 'Ex: Hortifruti, Limpeza, Pendências...',
                    })}
                    placeholderTextColor="#6D7886"
                    maxLength={40}
                    onSubmitEditing={handleConfirm}
                    returnKeyType="done"
                  />
                </InputContainer>

                <ButtonsRow>
                  <CancelButton onPress={onRequestClose}>
                    <CancelText>
                      {t('buttons.cancel', { defaultValue: 'Cancelar' })}
                    </CancelText>
                  </CancelButton>
                  <ConfirmButton
                    disabled={!title.trim()}
                    onPress={handleConfirm}>
                    <ConfirmText disabled={!title.trim()}>
                      {t('buttons.save', { defaultValue: 'Salvar' })}
                    </ConfirmText>
                  </ConfirmButton>
                </ButtonsRow>
              </ModalBox>
            </TouchableWithoutFeedback>
          </Animated.View>
        </KeyboardAvoidingView>
      </BlurredModal>
    );
  },
);
