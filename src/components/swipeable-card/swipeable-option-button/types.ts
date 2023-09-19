import {Animated} from 'react-native';
import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../../animated-icons/animated-icon/types';
import {MenuOption} from '../../menu-options/types';

export type SwipeableOptionProps = {
  Icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
  backgroundColor: string;
  onPress?: () => void;
  optionSize?: number | '100%';
  text?: string;
  progress?: Animated.AnimatedInterpolation<string | number>;
  dragX?: Animated.AnimatedInterpolation<string | number>;
  popoverMenuOptions?: MenuOption[];
};

export type SwipeableOptionRef = {
  playAnimation: () => void;
  showPopoverMenu: () => void;
};
