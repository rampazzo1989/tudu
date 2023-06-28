import Lottie from 'lottie-react-native';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {useHashGenerator} from '../../../hooks/useHashGenerator';
import {useIdlyAnimatedComponent} from '../../../hooks/useIdlyAnimatedComponent';
import {BaseAnimatedIconProps, BaseAnimatedIconRef} from './types';

const BaseAnimatedIcon = memo(
  forwardRef<BaseAnimatedIconRef, BaseAnimatedIconProps>(
    (
      {
        componentName,
        initialFrame = 0,
        finalFrame = 500,
        animateWhenIdle = false,
        ...props
      },
      ref,
    ) => {
      const animationRef = useRef<Lottie | null>(null);

      useImperativeHandle(
        ref,
        () => {
          return {
            play() {
              animationRef.current?.play(initialFrame, finalFrame);
            },
            pause() {
              animationRef.current?.pause();
            },
          };
        },
        [finalFrame, initialFrame],
      );

      useEffect(() => {
        if (props.autoPlay) {
          setTimeout(() => {
            animationRef.current?.play(initialFrame, finalFrame);
          }, 500);
        }
      }, [finalFrame, initialFrame, props.autoPlay]);

      const {key: componentKey} = useHashGenerator({componentName});

      useIdlyAnimatedComponent({
        componentRef: animationRef,
        componentKey,
        initialFrame,
        finalFrame,
        shouldAnimate: animateWhenIdle,
      });

      return <Lottie loop={false} {...props} ref={animationRef} />;
    },
  ),
);

export {BaseAnimatedIcon};
