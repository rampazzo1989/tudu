import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const RenameIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(options?: AnimationOptions) {
            if (options?.animationLayer === 'intro') {
              iconRef.current?.play({
                initialFrame: 0,
                finalFrame: 70,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else if (options?.animationLayer === 'hover') {
              iconRef.current?.play({
                initialFrame: 70,
                finalFrame: 150,
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
        source={require('../../../assets/lottie/rename.json')}
        loop={false}
        componentName="RenameIcon"
        animateWhenIdle
        initialFrame={70}
        staticStateFrame={70}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {RenameIcon};
