import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface MicIconProps {
  size?: number;
  isListening?: boolean;
  color?: string;
  activeColor?: string;
}

const MicIcon: React.FC<MicIconProps> = memo(
  ({
    size = 20,
    isListening = false,
    color = '#8E8E93',
    activeColor = '#EF4444',
  }) => {
    const scale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);

    useEffect(() => {
      if (isListening) {
        scale.value = withRepeat(
          withSequence(
            withTiming(1.2, { duration: 600 }),
            withTiming(1.0, { duration: 600 }),
          ),
          -1,
          true,
        );
        pulseOpacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: 600 }),
            withTiming(0.2, { duration: 600 }),
          ),
          -1,
          true,
        );
      } else {
        scale.value = withTiming(1, { duration: 200 });
        pulseOpacity.value = withTiming(0, { duration: 200 });
      }
    }, [isListening, scale, pulseOpacity]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const pulseRingStyle = useAnimatedStyle(() => ({
      opacity: pulseOpacity.value,
      transform: [{ scale: scale.value * 1.3 }],
    }));

    const currentColor = isListening ? activeColor : color;

    return (
      <View style={styles.wrapper}>
        {isListening && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                width: size + 12,
                height: size + 12,
                borderRadius: (size + 12) / 2,
                backgroundColor: activeColor,
              },
              pulseRingStyle,
            ]}
          />
        )}
        <Animated.View style={animatedContainerStyle}>
          <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none">
            {/* Mic capsule */}
            <Rect
              x="9"
              y="2"
              width="6"
              height="12"
              rx="3"
              fill={currentColor}
            />
            {/* Mic cradle */}
            <Path
              d="M5 10v1a7 7 0 0014 0v-1"
              stroke={currentColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Mic stand */}
            <Path
              d="M12 18v4M8 22h8"
              stroke={currentColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  pulseRing: {
    position: 'absolute',
  },
});

export { MicIcon };
