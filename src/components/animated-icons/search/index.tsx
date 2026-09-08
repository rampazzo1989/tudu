import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';
import {SearchSvg} from '../../../assets/static/tudu-icons';

const SearchIcon = memo(
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
        loop={false}
        initialFrame={60}
        finalFrame={150}
        staticStateFrame={60}
        componentName="SearchIcon"
        source={require('../../../assets/lottie/search.json')}
        StaticComponent={SearchSvg}
        ref={iconRef}
        {...props}
      />
    );
  }),
);

export {SearchIcon};
