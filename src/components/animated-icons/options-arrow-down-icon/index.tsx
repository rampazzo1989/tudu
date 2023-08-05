import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const OptionsArrowDownIcon = memo(
  forwardRef<BaseAnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          play() {
            iconRef.current?.play();
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
        animateWhenIdle
        finalFrame={60}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {OptionsArrowDownIcon};
