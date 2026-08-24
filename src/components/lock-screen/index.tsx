import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { Logo } from '../../scenes/splash-screen/styles';
import { useSecurityService } from '../../service/security';
import { PinDots } from './pin-dots';
import { PinPad } from './pin-pad';
import {
  AppIconWrapper,
  HeaderSection,
  LockContainer,
  LockoutBadge,
  LockoutText,
  LockSubtitle,
  LockTitle,
} from './styles';
import { LockScreenProps } from './types';

const PIN_LENGTH = 4;

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlockSuccess }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    settings,
    sensorInfo,
    isLockedOut,
    getRemainingLockoutSeconds,
    unlockWithPin,
    unlockWithBiometrics,
  } = useSecurityService();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSecs, setLockoutSecs] = useState(0);

  const shakeTranslateX = useSharedValue(0);
  const hasTriggeredInitialBio = useRef(false);

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

  // Check and update lockout countdown
  useEffect(() => {
    const check = () => {
      const locked = isLockedOut();
      if (locked) {
        setLockoutSecs(getRemainingLockoutSeconds());
      } else {
        setLockoutSecs(0);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [getRemainingLockoutSeconds, isLockedOut]);

  const handleBiometricsAuth = useCallback(async () => {
    if (lockoutSecs > 0) return;
    const success = await unlockWithBiometrics(
      t('lockScreen.biometricsPrompt', { defaultValue: 'Desbloquear Tudú' }),
      t('buttons.cancel', { defaultValue: 'Cancelar' }),
    );
    if (success) {
      RNReactNativeHapticFeedback.trigger('notificationSuccess');
      onUnlockSuccess?.();
    }
  }, [lockoutSecs, onUnlockSuccess, t, unlockWithBiometrics]);

  // Initial trigger for biometrics on screen display
  useEffect(() => {
    if (
      settings.isBiometricsEnabled &&
      sensorInfo.available &&
      !hasTriggeredInitialBio.current &&
      lockoutSecs === 0
    ) {
      hasTriggeredInitialBio.current = true;
      // Slight timeout to let the screen mount completely
      const timeout = setTimeout(() => {
        handleBiometricsAuth();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [
    handleBiometricsAuth,
    lockoutSecs,
    sensorInfo.available,
    settings.isBiometricsEnabled,
  ]);

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (lockoutSecs > 0) return;
      if (enteredPin.length >= PIN_LENGTH) return;

      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === PIN_LENGTH) {
        // Validate PIN
        const result = unlockWithPin(nextPin);
        if (result.success) {
          RNReactNativeHapticFeedback.trigger('notificationSuccess');
          setEnteredPin('');
          onUnlockSuccess?.();
        } else {
          RNReactNativeHapticFeedback.trigger('notificationError');
          triggerShake();
          if (result.isLockedOut) {
            setErrorMessage(
              t('lockScreen.lockedOut', {
                defaultValue:
                  'Muitas tentativas incorretas. Aguarde alguns segundos.',
              }),
            );
          } else {
            setErrorMessage(
              t('lockScreen.wrongPin', {
                defaultValue: 'PIN incorreto. Tente novamente.',
              }),
            );
          }
          // Clear pin after shake
          setTimeout(() => {
            setEnteredPin('');
          }, 350);
        }
      }
    },
    [
      enteredPin,
      lockoutSecs,
      onUnlockSuccess,
      t,
      triggerShake,
      unlockWithPin,
    ],
  );

  const handleDeletePress = useCallback(() => {
    if (lockoutSecs > 0) return;
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  }, [lockoutSecs]);

  const showBioButton =
    settings.isBiometricsEnabled && sensorInfo.available && lockoutSecs === 0;

  return (
    <LockContainer insetsTop={insets.top} insetsBottom={insets.bottom}>
      <StatusBar
        backgroundColor={theme.colors.pageBackground}
        barStyle="light-content"
      />

      <HeaderSection>
        <AppIconWrapper>
          <Logo width={36} height={40} />
        </AppIconWrapper>
        <LockTitle>
          {t('lockScreen.title', { defaultValue: 'Tudú Bloqueado' })}
        </LockTitle>
        <LockSubtitle isError={!!errorMessage}>
          {errorMessage ||
            t('lockScreen.subtitle', {
              defaultValue: 'Digite seu PIN para acessar suas listas',
            })}
        </LockSubtitle>

        {lockoutSecs > 0 && (
          <LockoutBadge>
            <LockoutText>
              {t('lockScreen.lockoutTimer', {
                seconds: lockoutSecs,
                defaultValue: `Tente novamente em ${lockoutSecs}s`,
              })}
            </LockoutText>
          </LockoutBadge>
        )}
      </HeaderSection>

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
        onBiometricsPress={handleBiometricsAuth}
        showBiometricsButton={showBioButton}
        biometricsType={sensorInfo.biometryType}
        disabled={lockoutSecs > 0}
      />
    </LockContainer>
  );
};
