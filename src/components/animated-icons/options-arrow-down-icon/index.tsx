import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const OptionsArrowDownIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play(options?: AnimationOptions) {
            iconRef.current?.play(options);
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
        source={require('../../../assets/lottie/threedots_close.json')}
        loop={false}
        componentName="OptionsArrowDownIcon"
        finalFrame={60}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {OptionsArrowDownIcon};
