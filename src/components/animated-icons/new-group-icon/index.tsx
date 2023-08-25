import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps, BaseAnimatedIconRef} from '../animated-icon/types';

const NewGroupIcon = memo(
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
        source={require('../../../assets/lottie/new_group.json')}
        loop={false}
        componentName="NewGroupIcon"
        animateWhenIdle
        initialFrame={60}
        staticStateFrame={60}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {NewGroupIcon};
