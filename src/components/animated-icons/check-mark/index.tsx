import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const CheckMarkIcon = memo(
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
                finalFrame: 30,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else if (options?.animationLayer === 'toggleOff') {
              iconRef.current?.play({
                initialFrame: 30,
                finalFrame: 0,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else {
              iconRef.current?.play({
                onAnimationFinish: options?.onAnimationFinish,
                delay: options?.delay,
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
        source={require('../../../assets/lottie/check_mark.json')}
        loop={false}
        componentName="CheckMarkIcon"
        size={24}
        staticStateFrame={0}
        finalFrame={30}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

const CheckMarkIconActionAnimation = memo(
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
                finalFrame: 30,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else if (options?.animationLayer === 'toggleOff') {
              iconRef.current?.play({
                initialFrame: 30,
                finalFrame: 0,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else {
              iconRef.current?.play({
                onAnimationFinish: () =>
                  setTimeout(() => options?.onAnimationFinish?.(), 1500),
                delay: options?.delay,
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
    return <CheckMarkIcon ref={iconRef} size={38} />;
  }),
);

export {CheckMarkIcon, CheckMarkIconActionAnimation};
