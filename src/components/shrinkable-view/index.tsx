import React, {forwardRef, memo, useCallback} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ShrinkableViewProps
  extends Animated.AnimateProps<TouchableOpacityProps> {
  scaleFactor?: number;
  onPress?: () => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ShrinkableView: React.FC<ShrinkableViewProps> = memo(
  forwardRef<TouchableOpacity, ShrinkableViewProps>(
    ({children, style, scaleFactor = 0.1, onPress, ...props}, ref) => {
      const scaleValue = useSharedValue(1);

      const handlePress = useCallback(() => {
        onPress?.();
        RNReactNativeHapticFeedback.trigger('keyboardTap');
        scaleValue.value = withTiming(1 - scaleFactor, {duration: 100}, () => {
          scaleValue.value = withTiming(
            1 + scaleFactor,
            {duration: 100},
            () => {
              scaleValue.value = withTiming(1, {duration: 150});
            },
          );
        });
      }, [onPress, scaleFactor, scaleValue]);

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
