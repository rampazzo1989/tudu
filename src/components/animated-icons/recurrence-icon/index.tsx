import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import { AnimatedIconContainer } from './styles';

const RecurrenceIcon = memo(
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
        source={require('../../../assets/lottie/recurrence.lottie')}
        loop={false}
        componentName="RecurrenceIcon"
        size={30}
        initialFrame={60}
        finalFrame={165}
        staticStateFrame={60}
        ref={iconRef}
        {...props}
      />
    </AnimatedIconContainer>
    );
  }),
);

export {RecurrenceIcon};
