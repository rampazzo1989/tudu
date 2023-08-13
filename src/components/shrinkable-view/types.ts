import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';

export interface ShrinkableViewProps
  extends Animated.AnimateProps<TouchableOpacityProps> {
  scaleFactor?: number;
  onPress?: () => void;
}
