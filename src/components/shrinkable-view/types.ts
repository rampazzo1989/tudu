import {TouchableOpacityProps} from 'react-native';
import Animated from 'react-native-reanimated';

export interface ShrinkableViewProps
  extends Animated.AnimateProps<TouchableOpacityProps> {
  scaleFactor?: number;
  onPress?: () => void;
  /**
   * Delays the onPress event callback for animation purposes on the time informed here (ms).
   */
  delayPressEvent?: number;
  /**
   * Waits for the animation to finish to call the onPress function.
   */
  waitForAnimation?: boolean;
}
