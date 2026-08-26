import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSpotlightTour } from './context';
import { SpotlightTargetProps, TargetLayout } from './types';

export const SpotlightTarget: React.FC<SpotlightTargetProps> = ({
  name,
  children,
  style,
  shape = 'rect',
  borderRadius = 16,
  padding = 8,
}) => {
  const viewRef = useRef<View>(null);
  const { registerTarget, unregisterTarget } = useSpotlightTour();

  const measure = useCallback((): Promise<TargetLayout | null> => {
    return new Promise(resolve => {
      if (!viewRef.current) {
        resolve(null);
        return;
      }
      viewRef.current.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) {
          resolve({
            x,
            y,
            width,
            height,
            shape,
            borderRadius,
            padding,
          });
        } else {
          viewRef.current?.measure((_fx, _fy, w, h, px, py) => {
            if (w > 0 && h > 0) {
              resolve({
                x: px,
                y: py,
                width: w,
                height: h,
                shape,
                borderRadius,
                padding,
              });
            } else {
              resolve(null);
            }
          });
        }
      });
    });
  }, [borderRadius, padding, shape]);

  useEffect(() => {
    registerTarget(name, measure);
    return () => {
      unregisterTarget(name);
    };
  }, [name, measure, registerTarget, unregisterTarget]);

  return (
    <View ref={viewRef} style={style} collapsable={false}>
      {children}
    </View>
  );
};
