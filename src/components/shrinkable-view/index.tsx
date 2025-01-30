import React, {forwardRef, memo, useCallback} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ShrinkableViewProps} from './types';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ShrinkableView: React.FC<ShrinkableViewProps> = memo(
  forwardRef<typeof TouchableOpacity, ShrinkableViewProps>(
    (
      {
        children,
        style,
        onPress,
        scaleFactor = 0.1,
        delayPressEvent = 0,
        waitForAnimation = false,
        ...props
      },
      ref,
    ) => {
      const scaleValue = useSharedValue(1);

      const shrink = useCallback(
        (callback?: () => void) => {
          scaleValue.value = withTiming(
            1 - scaleFactor,
            {duration: 100},
            () => {
              scaleValue.value = withTiming(
                1 + scaleFactor,
                {duration: 100},
                () => {
                  scaleValue.value = withTiming(
                    1,
                    {duration: 150},
                    callback ? runOnJS(callback) : undefined,
                  );
                },
              );
            },
          );
        },
        [scaleFactor, scaleValue],
      );

      const handlePress = useCallback(() => {
        RNReactNativeHapticFeedback.trigger(
          Platform.OS === 'ios' ? 'soft' : 'clockTick',
        );
        if (waitForAnimation) {
          shrink(onPress);
        } else {
          setTimeout(() => onPress?.(), delayPressEvent);
          shrink();
        }
      }, [delayPressEvent, onPress, shrink, waitForAnimation]);

      const animatedStyles = useAnimatedStyle(() => {
        return {
          transform: [{scale: scaleValue.value}],
        };
      }, []);

      return (
        <AnimatedTouchableOpacity
          style={[style, animatedStyles]}
          activeOpacity={1}
          onPress={handlePress}
          ref={ref}
          {...props}>
          {children}
        </AnimatedTouchableOpacity>
      );
    },
  ),
);

export {ShrinkableView};
