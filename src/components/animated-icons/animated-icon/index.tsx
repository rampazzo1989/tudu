import Lottie from 'lottie-react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
        staticStateFrame = 0,
        ...props
      },
      ref,
    ) => {
      const animationRef = useRef<Lottie | null>(null);
      const [toggle, setToggle] = useState(false);
      const [animationFinishCallback, setAnimationFinishCallback] =
        useState<() => void>();

      useImperativeHandle(
        ref,
        () => {
          return {
            play(onAnimationFinish?: () => void) {
              animationRef.current?.play(initialFrame, finalFrame);
              setAnimationFinishCallback(
                onAnimationFinish ? () => onAnimationFinish : undefined,
              );
            },
            pause() {
              animationRef.current?.pause();
            },
            toggle() {
              if (toggle) {
                animationRef.current?.play(finalFrame, initialFrame);
              } else {
                animationRef.current?.play(initialFrame, finalFrame);
              }
              setToggle(x => !x);
            },
          };
        },
        [finalFrame, initialFrame, toggle],
      );

      useEffect(() => {
        if (props.autoPlay) {
          setTimeout(() => {
            animationRef.current?.play(initialFrame, finalFrame);
          }, props.autoPlayDelay ?? 500);
        }
      }, [finalFrame, initialFrame, props.autoPlay, props.autoPlayDelay]);

      const {key: componentKey} = useHashGenerator({seedText: componentName});

      const handleAnimationFinish = useCallback(() => {
        animationFinishCallback?.();
        setAnimationFinishCallback(undefined);
      }, [animationFinishCallback]);

      useIdlyAnimatedComponent({
        componentRef: animationRef,
        componentKey,
        initialFrame,
        finalFrame,
        shouldAnimate: animateWhenIdle,
        staticStateFrame,
      });

      return (
        <Lottie
          loop={false}
          {...props}
          ref={animationRef}
          onAnimationFinish={handleAnimationFinish}
        />
      );
    },
  ),
);

export {BaseAnimatedIcon};
