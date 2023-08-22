import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {shake} from '../../utils/animation-utils';
import {BlurredModal} from '../blurred-modal';
import {GradientSeparator} from '../gradient-separator';
import {
  ButtonsContainer,
  PopupContainer,
  PopupTitle,
  PopupTitleContainer,
  PopupButton,
  ButtonLabel,
  styles,
  ContentContainer,
} from './styles';
import {PopupModalProps} from './types';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const PopupModal: React.FC<PopupModalProps> = memo(
  ({
    children,
    title,
    onRequestClose,
    buttons,
    Icon,
    visible,
    shakeOnShow,
    haptics = false,
    ...props
  }) => {
    const shakeValue = useSharedValue(0);
    const theme = useTheme();

    const iconAnimationDelay = 400;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: shakeValue.value}],
      };
    });

    useEffect(() => {
      if (!visible) {
        return;
      }
      const shakeFn = () => {
        if (shakeOnShow) {
          shake(shakeValue, 4);
        }
      };
      const hapticsFeedbackFn = () => {
        if (haptics) {
          RNReactNativeHapticFeedback.trigger('notificationWarning');
        }
      };
      setTimeout(() => {
        shakeFn();
        hapticsFeedbackFn();
      }, 100);
    }, [haptics, shakeOnShow, shakeValue, visible]);

    return (
      <BlurredModal
        transparent
        onRequestClose={onRequestClose}
        visible={visible}
        {...props}>
        <PopupContainer style={animatedStyle}>
          {title && (
            <View>
              <PopupTitleContainer>
                {!!Icon && (
                  <Icon
                    autoPlay
                    autoPlayDelay={iconAnimationDelay}
                    style={styles.icon}
                    size={24}
                    animateWhenIdle={false}
                  />
                )}
                <PopupTitle>{`${title}`}</PopupTitle>
              </PopupTitleContainer>
              <GradientSeparator
                colorArray={theme.colors.defaultSeparatorGradientColors}
                marginTop={10}
              />
            </View>
          )}
          <ContentContainer>
            {children}
            {buttons && (
              <ButtonsContainer shouldWrap={buttons.length > 2}>
                {buttons.map(button => (
                  <PopupButton
                    onPress={button.onPress}
                    highlight={button.highlight}
                    disabled={button.disabled}
                    key={button.label}>
                    <ButtonLabel>{button.label}</ButtonLabel>
                  </PopupButton>
                ))}
              </ButtonsContainer>
            )}
          </ContentContainer>
        </PopupContainer>
      </BlurredModal>
    );
  },
);

export {PopupModal};
