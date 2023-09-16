import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const PlusIcon = memo(
  forwardRef<BaseAnimatedIconRef, AnimatedIconProps>((props, ref) => {
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
        source={require('../../../assets/lottie/plus.json')}
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
