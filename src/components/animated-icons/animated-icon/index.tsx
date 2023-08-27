import Lottie from 'lottie-react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useHashGenerator} from '../../../hooks/useHashGenerator';
import {useIdlyAnimatedComponent} from '../../../hooks/useIdlyAnimatedComponent';
import {
  AnimationOptions,
  BaseAnimatedIconProps,
  BaseAnimatedIconRef,
  BaseAnimationOptions,
} from './types';

const BaseAnimatedIcon = memo(
  forwardRef<BaseAnimatedIconRef, BaseAnimatedIconProps>(
    (
      {
        componentName,
        initialFrame = 0,
        finalFrame = 500,
        animateWhenIdle = false,
        staticStateFrame = 0,
        size,
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
            play(options?: BaseAnimationOptions) {
              setTimeout(
                () => {
                  animationRef.current?.play(
                    options?.initialFrame ?? initialFrame,
                    options?.finalFrame ?? finalFrame,
                  );
                  setAnimationFinishCallback(
                    options?.onAnimationFinish
                      ? () => options.onAnimationFinish
                      : undefined,
                  );
                },

                options?.delay ?? 0,
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

      const sizedStyle = useMemo(() => {
        if (size) {
          return {height: size, width: size};
        } else {
          return {};
        }
      }, [size]);

      return (
        <Lottie
          loop={false}
          {...props}
          style={[props.style, sizedStyle]}
          ref={animationRef}
          onAnimationFinish={handleAnimationFinish}
        />
      );
    },
  ),
);

export {BaseAnimatedIcon};
