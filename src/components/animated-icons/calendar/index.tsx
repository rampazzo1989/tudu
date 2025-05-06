import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps, AnimatedIconRef, AnimationOptions, BaseAnimatedIconRef} from '../animated-icon/types';

const CalendarIcon = memo(
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
        source={require('../../../assets/lottie/calendar_black.json')}
        loop={false}
        componentName="CalendarIcon"
        initialFrame={60}
        finalFrame={120}
        ref={ref}
        {...props}
      />
    );
  })
);

export {CalendarIcon};


