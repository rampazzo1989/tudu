import React, {memo, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
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
} from './styles';
import {PopupModalProps} from './types';

const PopupModal: React.FC<PopupModalProps> = memo(
  ({
    children,
    title,
    onRequestClose,
    buttons,
    Icon,
    visible,
    shakeOnShow,
    ...props
  }) => {
    const shakeValue = useSharedValue(0);

    const iconAnimationDelay = shakeOnShow ? 750 : 500;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: shakeValue.value}],
      };
    });

    useEffect(() => {
      if (visible && shakeOnShow) {
        setTimeout(() => {
          shake(shakeValue, 5);
        }, 100);
      }
    }, [shakeOnShow, shakeValue, visible]);

    return (
      <BlurredModal
        transparent
        onRequestClose={onRequestClose}
        visible={visible}
        {...props}>
        <Animated.View style={animatedStyle}>
          <PopupContainer>
            {title && (
              <>
                <PopupTitleContainer>
                  {!!Icon && (
                    <Icon
                      autoPlay
                      autoPlayDelay={iconAnimationDelay}
                      style={styles.icon}
                    />
                  )}
                  <PopupTitle>{`${title}`}</PopupTitle>
                </PopupTitleContainer>
                <GradientSeparator
                  colorArray={['#3C414A', '#FFFFFF20', '#3C414A']}
                />
              </>
            )}
            {children}
            {buttons && (
              <ButtonsContainer shouldWrap={buttons.length > 2}>
                {buttons.map(button => (
                  <PopupButton
                    onPress={button.onPress}
                    highlight={button.highlight}
                    key={button.label}>
                    <ButtonLabel>{button.label}</ButtonLabel>
                  </PopupButton>
                ))}
              </ButtonsContainer>
            )}
          </PopupContainer>
        </Animated.View>
      </BlurredModal>
    );
  },
);

export {PopupModal};
