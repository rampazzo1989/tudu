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

        if (jsonData.layers && Array.isArray(jsonData.layers)) {
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

      const getColorFilters = (color?: string) => {
        if (!color) {
          return;
        }
        try {
          const cleanJSON = removeInvalidJSONTokens(props.source);
          const layersNames = extractLayerNames(cleanJSON);
          return layersNames.map(x => ({keypath: x, color}));
        } catch (error) {
          return undefined;
        }
      };

      return (
        <Lottie
          loop={false}
          {...props}
          style={[props.style, sizedStyle]}
          colorFilters={getColorFilters(overrideColor)}
          ref={animationRef}
          onAnimationFinish={handleAnimationFinish}
        />
      );
    },
  ),
);

export {BaseAnimatedIcon};
