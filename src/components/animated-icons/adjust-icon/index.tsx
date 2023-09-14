import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const AdjustIcon = memo(
  forwardRef<BaseAnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play() {
            iconRef.current?.play();
          },
          pause() {
            iconRef.current?.pause();
          },
          toggle() {
            iconRef.current?.toggle();
          },
        };
      },
      [],
    );

    return (
      <AnimatedIcon
        source={require('../../../assets/lottie/adjust.json')}
        loop={false}
        componentName="AdjustIcon"
        initialFrame={90}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {AdjustIcon};
