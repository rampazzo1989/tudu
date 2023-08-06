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
    const theme = useTheme();

    const iconAnimationDelay = shakeOnShow ? 600 : 500;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: shakeValue.value}],
      };
    });

    useEffect(() => {
      if (visible && shakeOnShow) {
        setTimeout(() => {
          shake(shakeValue, 4);
        }, 100);
      }
    }, [shakeOnShow, shakeValue, visible]);

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
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
            }}>
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
          </View>
        </PopupContainer>
      </BlurredModal>
    );
  },
);

export {PopupModal};
