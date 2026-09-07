import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface SkeletonProps {
  count?: number;
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 1, style }) => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      shimmer.value,
      [0, 1],
      [style?.backgroundColor?.toString() ?? '#E1E9EE', '#63676e'] // Alternando entre tons de cinza
    ),
  }));

  if (count === 1) {
    return (
      <Animated.View
        style={[
          styles.skeleton,
          style?.flex !== undefined && !style?.width ? { width: undefined } : null,
          animatedStyle,
          style,
        ]}
      />
    );
  }

  return (
    <>
      {Array.from({ length: count || 3 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeleton, animatedStyle, style]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    width: '100%',
    height: 20,
    borderRadius: 8,
    marginVertical: 4,
  },
});

export default Skeleton;