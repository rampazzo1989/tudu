import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';

const UngroupIcon = memo(
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
      <BaseAnimatedIcon
        source={require('../../../assets/lottie/ungroup.json')}
        loop={false}
        componentName="UngroupIcon"
        initialFrame={70}
        staticStateFrame={70}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {UngroupIcon};
