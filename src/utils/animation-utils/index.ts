import {
  Easing,
  SharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const shake = (position: SharedValue<number>, times: number = 1) => {
  position.value = withRepeat(
    withTiming(4, {duration: 80, easing: Easing.linear}),
    times,
    true,
    () => (position.value = withSpring(0, {duration: 500})),
  );
};
