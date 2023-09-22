import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const ListDefaultIcon = memo(
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
                finalFrame: 60,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else if (options?.animationLayer === 'toggleOff') {
              iconRef.current?.play({
                initialFrame: 60,
                finalFrame: 0,
                delay: options.delay,
                onAnimationFinish: options.onAnimationFinish,
              });
            } else {
              // iconRef.current?.play({
              //   initialFrame: 60,
              //   finalFrame: 0,
              //   delay: options?.delay,
              //   onAnimationFinish: () => {
              //     iconRef.current?.play({
              //       initialFrame: 0,
              //       finalFrame: 60,
              //       delay: options?.delay,
              //       onAnimationFinish: options?.onAnimationFinish,
              //     });
              //   },
              // });
              iconRef.current?.play({
                delay: options?.delay,
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
      <AnimatedIcon
        source={require('../../../assets/lottie/list_icon.json')}
        loop={false}
        componentName="ListDefaultIcon"
        staticStateFrame={60}
        ref={iconRef}
        speed={2}
        {...props}
      />
    );
  }),
);

export {ListDefaultIcon};
