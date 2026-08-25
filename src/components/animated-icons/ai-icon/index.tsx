import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { BaseAnimatedIcon } from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import { AnimatedIconContainer } from './styles';

const AIIcon = memo(
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
      <AnimatedIconContainer>
        <BaseAnimatedIcon
          source={require('../../../assets/lottie/ai.lottie')}
          loop={false}
          componentName="AIIcon"
          size={32}
          initialFrame={0}
          finalFrame={165}
          staticStateFrame={0}
          ref={iconRef}
          {...props}
        />
      </AnimatedIconContainer>
    );
  }),
);

export { AIIcon };
