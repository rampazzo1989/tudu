import React, {memo, useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Animated, {FadeInDown, FadeOutDown, LinearTransition, SlideInDown, SlideInUp, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
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
  KeyboardAvoidingView,
  PopupTopContainer,
  TopContainerLabel,
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
    TopContainerComponent,
    haptics = false,
    topContainerVisible = false,
    ...props
  }) => {
    const shakeValue = useSharedValue(0);
    const theme = useTheme();
    const [showLayoutAnimation, setShowLayoutAnimation] = useState(false);

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

    const handleShow = useCallback(() => {
      setTimeout(() => {
        setShowLayoutAnimation(true);
      }, 300);
    }, []);

    return (
      <BlurredModal
        transparent
        onRequestClose={onRequestClose}
        onShow={handleShow}
        visible={visible}
        {...props}>
        <KeyboardAvoidingView behavior="padding" pointerEvents="auto">
          {visible && topContainerVisible && TopContainerComponent && (
            <PopupTopContainer entering={FadeInDown} exiting={FadeOutDown.duration(100)}>
              {TopContainerComponent}
            </PopupTopContainer>
          )}
          
          <PopupContainer layout={showLayoutAnimation && LinearTransition} style={animatedStyle} minimumSized={!children}>
            {title && (
              <>
                <PopupTitleContainer>
                  {!!Icon && (
                    <Icon
                      autoPlay
                      autoPlayDelay={iconAnimationDelay}
                      style={styles.icon}
                      size={22} />
                  )}
                  <PopupTitle>{`${title}`}</PopupTitle>
                </PopupTitleContainer>
                <GradientSeparator
                  colorArray={theme.colors.defaultSeparatorGradientColors}
                  marginTop={10} />
              </>
            )}
            {!!children && <ContentContainer>{children}</ContentContainer>}
            {buttons && (
              <ButtonsContainer layout={showLayoutAnimation && LinearTransition} shouldMarginTop={!children} alignCenter={buttons.length > 1}>
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
          </PopupContainer>
        </KeyboardAvoidingView>
      </BlurredModal>
    );
  },
);

export {PopupModal};
