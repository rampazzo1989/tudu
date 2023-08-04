import {
  Easing,
  SharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const shake = (position: SharedValue<number>, times: number = 1) => {
  position.value = withRepeat(
    withTiming(3, {duration: 60, easing: Easing.linear}),
    times,
    true,
    () => (position.value = withSpring(0, {duration: 500})),
  );
};
