import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableWithoutFeedback } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurredModal } from '../blurred-modal';
import { useSecurityService } from '../../service/security';
import { PinDots } from '../lock-screen/pin-dots';
import { PinPad } from '../lock-screen/pin-pad';
import {
  CancelButton,
  CancelButtonText,
  IconContainer,
  ModalContainer,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
} from './styles';
import { PinModalMode, PinModalProps } from './types';

const PIN_LENGTH = 4;

export const PinModal: React.FC<PinModalProps> = ({
  visible,
  mode,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { validateCurrentPin } = useSecurityService();

  const [step, setStep] = useState(1);
  const [enteredPin, setEnteredPin] = useState('');
  const [tempNewPin, setTempNewPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shakeTranslateX = useSharedValue(0);

  const triggerShake = useCallback(() => {
    shakeTranslateX.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(4, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  }, [shakeTranslateX]);

  const animatedShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeTranslateX.value }],
    };
  });

  // Reset state on open/mode change
  useEffect(() => {
    if (visible) {
      setStep(1);
      setEnteredPin('');
      setTempNewPin('');
      setErrorMessage(null);
    }
  }, [mode, visible]);

  const getTitleAndSubtitle = () => {
    if (mode === 'setup') {
      if (step === 1) {
        return {
          title: t('pinModal.setupTitle', { defaultValue: 'Criar PIN de Acesso' }),
          subtitle: t('pinModal.setupSubtitle', {
            defaultValue: 'Digite um PIN de 4 dígitos',
          }),
        };
      }
      return {
        title: t('pinModal.confirmTitle', { defaultValue: 'Confirmar PIN' }),
        subtitle: t('pinModal.confirmSubtitle', {
          defaultValue: 'Digite novamente o PIN para confirmar',
        }),
      };
    }

    if (mode === 'change') {
      if (step === 1) {
        return {
          title: t('pinModal.changeCurrentTitle', {
            defaultValue: 'PIN Atual',
          }),
          subtitle: t('pinModal.changeCurrentSubtitle', {
            defaultValue: 'Digite seu PIN atual',
          }),
        };
      }
      if (step === 2) {
        return {
          title: t('pinModal.changeNewTitle', { defaultValue: 'Novo PIN' }),
          subtitle: t('pinModal.changeNewSubtitle', {
            defaultValue: 'Digite o novo PIN de 4 dígitos',
          }),
        };
      }
      return {
        title: t('pinModal.confirmNewTitle', {
          defaultValue: 'Confirmar Novo PIN',
        }),
        subtitle: t('pinModal.confirmNewSubtitle', {
          defaultValue: 'Digite o novo PIN novamente',
        }),
      };
    }

    if (mode === 'disable') {
      return {
        title: t('pinModal.disableTitle', {
          defaultValue: 'Desativar Bloqueio',
        }),
        subtitle: t('pinModal.disableSubtitle', {
          defaultValue: 'Digite seu PIN atual para confirmar a desativação',
        }),
      };
    }

    return {
      title: t('pinModal.confirmActionTitle', {
        defaultValue: 'Confirmação de Segurança',
      }),
      subtitle: t('pinModal.confirmActionSubtitle', {
        defaultValue: 'Digite seu PIN para continuar',
      }),
    };
  };

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (enteredPin.length >= PIN_LENGTH) {
        return;
      }

      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === PIN_LENGTH) {
        if (mode === 'setup') {
          if (step === 1) {
            setTempNewPin(nextPin);
            setStep(2);
            setEnteredPin('');
          } else if (step === 2) {
            if (nextPin === tempNewPin) {
              RNReactNativeHapticFeedback.trigger('notificationSuccess');
              onSuccess(nextPin);
              onClose();
            } else {
              RNReactNativeHapticFeedback.trigger('notificationError');
              triggerShake();
              setErrorMessage(
                t('pinModal.mismatchError', {
                  defaultValue: 'Os PINs não coincidem. Tente novamente.',
                }),
              );
              setTimeout(() => {
                setStep(1);
                setEnteredPin('');
                setTempNewPin('');
              }, 400);
            }
          }
        } else if (mode === 'change') {
          if (step === 1) {
            const isValid = validateCurrentPin(nextPin);
            if (isValid) {
              RNReactNativeHapticFeedback.trigger('impactLight');
              setStep(2);
              setEnteredPin('');
            } else {
              RNReactNativeHapticFeedback.trigger('notificationError');
              triggerShake();
              setErrorMessage(
                t('pinModal.wrongCurrentPin', {
                  defaultValue: 'PIN atual incorreto. Tente novamente.',
                }),
              );
              setTimeout(() => {
                setEnteredPin('');
              }, 400);
            }
          } else if (step === 2) {
            setTempNewPin(nextPin);
            setStep(3);
            setEnteredPin('');
          } else if (step === 3) {
            if (nextPin === tempNewPin) {
              RNReactNativeHapticFeedback.trigger('notificationSuccess');
              onSuccess(nextPin);
              onClose();
            } else {
              RNReactNativeHapticFeedback.trigger('notificationError');
              triggerShake();
              setErrorMessage(
                t('pinModal.mismatchError', {
                  defaultValue: 'Os novos PINs não coincidem. Tente novamente.',
                }),
              );
              setTimeout(() => {
                setStep(2);
                setEnteredPin('');
                setTempNewPin('');
              }, 400);
            }
          }
        } else if (mode === 'disable' || mode === 'confirm') {
          const isValid = validateCurrentPin(nextPin);
          if (isValid) {
            RNReactNativeHapticFeedback.trigger('notificationSuccess');
            onSuccess(nextPin);
            onClose();
          } else {
            RNReactNativeHapticFeedback.trigger('notificationError');
            triggerShake();
            setErrorMessage(
              t('pinModal.wrongPin', {
                defaultValue: 'PIN incorreto. Tente novamente.',
              }),
            );
            setTimeout(() => {
              setEnteredPin('');
            }, 400);
          }
        }
      }
    },
    [
      enteredPin,
      mode,
      onClose,
      onSuccess,
      step,
      t,
      tempNewPin,
      triggerShake,
      validateCurrentPin,
    ],
  );

  const handleDeletePress = useCallback(() => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  }, []);

  const { title, subtitle } = getTitleAndSubtitle();

  return (
    <BlurredModal visible={visible} onTouchBackground={onClose}>
      <TouchableWithoutFeedback>
        <ModalContainer>
          <IconContainer>
            <Text style={{ fontSize: 24 }}>🔒</Text>
          </IconContainer>

          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalSubtitle isError={!!errorMessage}>
              {errorMessage || subtitle}
            </ModalSubtitle>
          </ModalHeader>

          <Animated.View style={animatedShakeStyle}>
            <PinDots
              length={PIN_LENGTH}
              filledCount={enteredPin.length}
              isError={!!errorMessage}
            />
          </Animated.View>

          <PinPad
            onDigitPress={handleDigitPress}
            onDeletePress={handleDeletePress}
            showBiometricsButton={false}
          />

          <CancelButton onPress={onClose} activeOpacity={0.7}>
            <CancelButtonText>
              {t('buttons.cancel', { defaultValue: 'Cancelar' })}
            </CancelButtonText>
          </CancelButton>
        </ModalContainer>
      </TouchableWithoutFeedback>
    </BlurredModal>
  );
};
