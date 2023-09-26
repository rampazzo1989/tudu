import React, {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {
  AnimatedIconProps,
  AnimatedIconRef,
  AnimationOptions,
  BaseAnimatedIconRef,
} from '../animated-icon/types';

const DeleteIcon = memo(
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
        source={require('../../../assets/lottie/trash2.json')}
        loop={false}
        componentName="DeleteIcon"
        ref={iconRef}
        initialFrame={80}
        finalFrame={150}
        staticStateFrame={80}
        {...props}
      />
    );
  }),
);

const DeleteIconActionAnimation = memo(
  forwardRef<AnimatedIconRef, AnimatedIconProps>((props, ref) => {
    return (
      <DeleteIcon size={30} ref={ref} initialFrame={160} finalFrame={240} />
    );
  }),
);

export {DeleteIcon, DeleteIconActionAnimation};
