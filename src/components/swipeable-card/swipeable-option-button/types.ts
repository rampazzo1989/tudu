import {Animated} from 'react-native';
import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../../animated-icons/animated-icon/types';

export type SwipeableOptionProps = {
  Icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
  backgroundColor: string;
  onPress: () => void;
  text?: string;
  progress?: Animated.AnimatedInterpolation<string | number>;
  dragX?: Animated.AnimatedInterpolation<string | number>;
};

export type SwipeableOptionRef = {
  playAnimation: () => void;
};
