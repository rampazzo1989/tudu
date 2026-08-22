import React, { useCallback } from 'react';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  KeypadButton,
  KeypadContainer,
  KeypadDigitText,
  KeypadRow,
  KeypadSpecialText,
} from './styles';
import { PinPadProps } from './types';

export const PinPad: React.FC<PinPadProps> = ({
  onDigitPress,
  onDeletePress,
  onBiometricsPress,
  showBiometricsButton = false,
  biometricsType,
  disabled = false,
}) => {
  const triggerHaptic = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('impactLight');
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (disabled) return;
      triggerHaptic();
      onDigitPress(digit);
    },
    [disabled, onDigitPress, triggerHaptic],
  );

  const handleDelete = useCallback(() => {
    if (disabled) return;
    triggerHaptic();
    onDeletePress();
  }, [disabled, onDeletePress, triggerHaptic]);

  const handleBiometrics = useCallback(() => {
    if (disabled) return;
    triggerHaptic();
    if (onBiometricsPress) {
      onBiometricsPress();
    }
  }, [disabled, onBiometricsPress, triggerHaptic]);

  const getBiometricsIcon = () => {
    if (biometricsType === 'FaceID') return '👤';
    return '👆';
  };

  return (
    <KeypadContainer>
      <KeypadRow>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('1')}
          activeOpacity={0.7}>
          <KeypadDigitText>1</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('2')}
          activeOpacity={0.7}>
          <KeypadDigitText>2</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('3')}
          activeOpacity={0.7}>
          <KeypadDigitText>3</KeypadDigitText>
        </KeypadButton>
      </KeypadRow>

      <KeypadRow>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('4')}
          activeOpacity={0.7}>
          <KeypadDigitText>4</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('5')}
          activeOpacity={0.7}>
          <KeypadDigitText>5</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('6')}
          activeOpacity={0.7}>
          <KeypadDigitText>6</KeypadDigitText>
        </KeypadButton>
      </KeypadRow>

      <KeypadRow>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('7')}
          activeOpacity={0.7}>
          <KeypadDigitText>7</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('8')}
          activeOpacity={0.7}>
          <KeypadDigitText>8</KeypadDigitText>
        </KeypadButton>
        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('9')}
          activeOpacity={0.7}>
          <KeypadDigitText>9</KeypadDigitText>
        </KeypadButton>
      </KeypadRow>

      <KeypadRow>
        <KeypadButton
          isSpecial
          disabled={disabled || !showBiometricsButton}
          onPress={handleBiometrics}
          activeOpacity={0.7}>
          {showBiometricsButton && (
            <KeypadSpecialText>{getBiometricsIcon()}</KeypadSpecialText>
          )}
        </KeypadButton>

        <KeypadButton
          disabled={disabled}
          onPress={() => handleDigit('0')}
          activeOpacity={0.7}>
          <KeypadDigitText>0</KeypadDigitText>
        </KeypadButton>

        <KeypadButton
          isSpecial
          disabled={disabled}
          onPress={handleDelete}
          activeOpacity={0.7}>
          <KeypadSpecialText>⌫</KeypadSpecialText>
        </KeypadButton>
      </KeypadRow>
    </KeypadContainer>
  );
};
