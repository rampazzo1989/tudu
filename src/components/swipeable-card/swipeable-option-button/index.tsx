import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {AnimatedIconRef} from '../../animated-icons/animated-icon/types';
import {Label, Touchable} from './styles';
import {SwipeableOptionProps, SwipeableOptionRef} from './types';

const SwipeableOptionButton = memo(
  forwardRef<SwipeableOptionRef, SwipeableOptionProps>(
    ({Icon, backgroundColor, onPress, text, progress, dragX}, ref) => {
      const iconRef = useRef<AnimatedIconRef>(null);

      useImperativeHandle(ref, () => {
        return {
          playAnimation: () => {
            iconRef.current?.play();
          },
        };
      });

      return (
        <Touchable backgroundColor={backgroundColor} onPress={onPress}>
          <Icon ref={iconRef} />
          <Label>{text}</Label>
        </Touchable>
      );
    },
  ),
);

export {SwipeableOptionButton};
