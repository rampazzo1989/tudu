import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { BaseAnimatedIcon } from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const NextIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(options?: AnimationOptions) {
            iconRef.current?.play({
              onAnimationFinish: options?.onAnimationFinish,
              delay: options?.delay,
            });
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
      <BaseAnimatedIcon
        source={require('../../../assets/lottie/back.json')} // Reusing the same animation
        loop={false}
        componentName="NextIcon"
        initialFrame={0}
        staticStateFrame={0}
        ref={iconRef}
        style={{ transform: [{ scaleX: -1 }] }} // Flip horizontally
        {...props}
      />
    );
  }),
);

export { NextIcon };