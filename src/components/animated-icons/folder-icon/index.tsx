import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const FolderIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(options?: AnimationOptions) {
            if (options?.animationLayer === 'toggleOn') {
              iconRef.current?.play({
                initialFrame: 180,
                finalFrame: 240,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else if (options?.animationLayer === 'toggleOff') {
              iconRef.current?.play({
                initialFrame: 240,
                finalFrame: 180,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else {
              iconRef.current?.play({
                initialFrame: 80,
                finalFrame: 150,
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
        source={require('../../../assets/lottie/folder.json')}
        loop={false}
        componentName="FolderIcon"
        animateWhenIdle={false}
        initialFrame={80}
        staticStateFrame={80}
        finalFrame={150}
        size={24}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {FolderIcon};
