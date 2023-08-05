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
        };
      },
      [],
    );

    return (
      <AnimatedIcon
        source={require('../../../assets/lottie/options_arrow_down.json')}
        loop={false}
        componentName="OptionsArrowDownIcon"
        animateWhenIdle
        initialFrame={0}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {OptionsArrowDownIcon};
