import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const TuduIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(options?: AnimationOptions) {
            if (options?.animationLayer === 'toggleOn') {
              iconRef.current?.play({
                initialFrame: 0,
                finalFrame: 80,
                onAnimationFinish: options.onAnimationFinish,
                delay: options.delay,
              });
            } else if (options?.animationLayer === 'toggleOff') {
              iconRef.current?.play({
                initialFrame: 80,
                finalFrame: 175,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else {
              iconRef.current?.play({
                onAnimationFinish: options?.onAnimationFinish,
              });
            }
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
        source={require('../../../assets/lottie/checked.json')}
        loop={false}
        componentName="TuduIcon"
        animateWhenIdle={false}
        initialFrame={80}
        staticStateFrame={80}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {TuduIcon};
