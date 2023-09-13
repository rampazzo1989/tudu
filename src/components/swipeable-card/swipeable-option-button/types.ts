import {Animated} from 'react-native';
import {AnimatedIconProps} from '../../animated-icons/animated-icon/types';

export type SwipeableOptionProps = {
  Icon: React.FC<AnimatedIconProps>;
  backgroundColor: string;
  onPress: () => void;
  text?: string;
  progress?: Animated.AnimatedInterpolation<string | number>;
  dragX?: Animated.AnimatedInterpolation<string | number>;
};
