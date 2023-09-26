import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const PlusIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        play() {
          iconRef.current?.play();
        },
        pause() {
          iconRef.current?.pause();
        },
        toggle() {
          iconRef.current?.toggle();
        },
      }),
      [],
    );

    return (
      <AnimatedIcon
        source={require('../../../assets/lottie/plus2.json')}
        loop={false}
        componentName="PlusIcon"
        ref={iconRef}
        staticStateFrame={0}
        {...props}
      />
    );
  }),
);

export {PlusIcon};
