import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';

const ProfileIcon = memo(
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
        source={require('../../../assets/lottie/account.json')}
        loop={false}
        componentName="ProfileIcon"
        animateWhenIdle
        initialFrame={70}
        staticStateFrame={70}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {ProfileIcon};
