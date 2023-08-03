import React, {memo} from 'react';
import Animated, {ZoomInRotate} from 'react-native-reanimated';
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
  ({children, title, onRequestClose, buttons, Icon, ...props}) => {
    return (
      <BlurredModal transparent onRequestClose={onRequestClose} {...props}>
        {props.visible && (
          <Animated.View entering={ZoomInRotate.duration(150)}>
            <PopupContainer>
              {title && (
                <>
                  <PopupTitleContainer>
                    {!!Icon && <Icon autoPlay style={styles.icon} />}
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
                    <PopupButton highlight={button.highlight}>
                      <ButtonLabel>{button.label}</ButtonLabel>
                    </PopupButton>
                  ))}
                </ButtonsContainer>
              )}
            </PopupContainer>
          </Animated.View>
        )}
      </BlurredModal>
    );
  },
);

export {PopupModal};
