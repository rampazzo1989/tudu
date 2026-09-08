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
        overrideColor,
        StaticComponent,
        ...props
      },
      ref,
    ) => {
      const animationRef = useRef<Lottie | null>(null);
      const [toggle, setToggle] = useState(false);
      const [isLottieActive, setIsLottieActive] = useState<boolean>(
        !StaticComponent || Boolean(props.autoPlay),
      );
      const isIdleAnimatingRef = useRef(false);
      const pendingPlayRef = useRef<{
        startFrame: number;
        endFrame: number;
        delay?: number;
      } | null>(null);
      const animationFinishCallbackRef = useRef<() => void>();

      useImperativeHandle(
        ref,
        () => {
          return {
            play(options?: BaseAnimationOptions) {
              isIdleAnimatingRef.current = false;
              animationFinishCallbackRef.current = options?.onAnimationFinish;
              const start = options?.initialFrame ?? initialFrame;
              const end = options?.finalFrame ?? finalFrame;
              const delay = options?.delay ?? 0;

              if (StaticComponent && !isLottieActive) {
                pendingPlayRef.current = {startFrame: start, endFrame: end, delay};
                setIsLottieActive(true);
              } else {
                setTimeout(() => {
                  animationRef.current?.play(start, end);
                }, delay);
              }
            },
            pause() {
              animationRef.current?.pause();
            },
            toggle() {
              isIdleAnimatingRef.current = false;
              const start = toggle ? finalFrame : initialFrame;
              const end = toggle ? initialFrame : finalFrame;

              if (StaticComponent && !isLottieActive) {
                pendingPlayRef.current = {startFrame: start, endFrame: end};
                setIsLottieActive(true);
              } else {
                animationRef.current?.play(start, end);
              }
              setToggle(x => !x);
            },
          };
        },
        [finalFrame, initialFrame, isLottieActive, toggle, StaticComponent],
      );

      // Trigger pending animation once Lottie is mounted
      useEffect(() => {
        if (isLottieActive && animationRef.current && pendingPlayRef.current) {
          const pending = pendingPlayRef.current;
          pendingPlayRef.current = null;
          const start = pending.startFrame;
          const end = pending.endFrame;
          const delay = pending.delay ?? 0;

          if (delay > 0) {
            const timer = setTimeout(() => {
              animationRef.current?.play(start, end);
            }, delay);
            return () => clearTimeout(timer);
          } else {
            animationRef.current?.play(start, end);
          }
        }
      }, [isLottieActive, initialFrame, finalFrame]);

      useEffect(() => {
        if (props.autoPlay) {
          const timer = setTimeout(() => {
            animationRef.current?.play(initialFrame, finalFrame);
          }, props.autoPlayDelay ?? 500);
          return () => clearTimeout(timer);
        }
      }, [finalFrame, initialFrame, props.autoPlay, props.autoPlayDelay]);

      const {key: componentKey} = useHashGenerator({seedText: componentName});

      const handleAnimationFinish = useCallback(
        (isCancelled: boolean) => {
          props.onAnimationFinish?.(isCancelled);
          const finishCb = animationFinishCallbackRef.current;
          animationFinishCallbackRef.current = undefined;
          finishCb?.();

          if (isIdleAnimatingRef.current) {
            isIdleAnimatingRef.current = false;
            if (StaticComponent && !props.loop) {
              setIsLottieActive(false);
            }
          }
        },
        [StaticComponent, props.loop, props.onAnimationFinish],
      );

      const handleIdleAnimate = useCallback(() => {
        isIdleAnimatingRef.current = true;
        pendingPlayRef.current = {startFrame: initialFrame, endFrame: finalFrame};
        setIsLottieActive(true);
      }, [initialFrame, finalFrame]);

      useIdlyAnimatedComponent({
        componentRef: animationRef,
        componentKey,
        initialFrame,
        finalFrame,
        shouldAnimate: animateWhenIdle,
        staticStateFrame,
        onAnimate: StaticComponent ? handleIdleAnimate : undefined,
      });

      const sizedStyle = useMemo(() => {
        return size === 'max'
          ? {flex: 1}
          : size
          ? {height: size, width: size}
          : {};
      }, [size]);

      function extractLayerNames(jsonData: any): string[] {
        const layerNames: string[] = [];

        function traverseLayers(layers: any[]) {
          for (const layer of layers) {
            if (layer.nm && typeof layer.nm === 'string') {
              layerNames.push(layer.nm);
            }
            if (layer.layers && Array.isArray(layer.layers)) {
              traverseLayers(layer.layers);
            }
          }
        }

        if (jsonData?.layers && Array.isArray(jsonData.layers)) {
          traverseLayers(jsonData.layers);
        }

        return layerNames;
      }

      const removeInvalidJSONTokens = (json: any) => {
        const cleanJSONString = JSON.stringify(json)
          .replace(/\$/g, '')
          .replace(/;/g, '')
          .replace(/\n/g, '');
        return JSON.parse(cleanJSONString);
      };

      const colorFilters = useMemo(() => {
        if (!overrideColor) {
          return undefined;
        }
        try {
          const cleanJSON = removeInvalidJSONTokens(props.source);
          const layersNames = extractLayerNames(cleanJSON);
          return layersNames.map(x => ({keypath: x, color: overrideColor}));
        } catch (error) {
          return undefined;
        }
      }, [overrideColor, props.source]);

      if (StaticComponent && !isLottieActive) {
        return (
          <StaticComponent
            size={size === 'max' ? undefined : size}
            color={overrideColor || (props as any).color || '#FFFFFF'}
            overrideColor={overrideColor}
            style={[props.style, sizedStyle]}
          />
        );
      }

      return (
        <Lottie
          loop={false}
          {...props}
          style={[props.style, sizedStyle]}
          colorFilters={colorFilters}
          ref={animationRef}
          onAnimationFinish={handleAnimationFinish}
        />
      );
    },
  ),
);

export {BaseAnimatedIcon};
