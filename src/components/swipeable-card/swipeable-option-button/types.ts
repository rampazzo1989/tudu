import {Animated} from 'react-native';
import {ForwardedRefAnimatedIcon} from '../../animated-icons/animated-icon/types';
import {MenuOption} from '../../menu-options/types';

export type SwipeableOptionProps = {
  Icon: ForwardedRefAnimatedIcon;
  backgroundColor: string;
  onPress?: () => void;
  optionSize?: number | '100%';
  text?: string;
  progress?: Animated.AnimatedInterpolation<string | number>;
  dragX?: Animated.AnimatedInterpolation<string | number>;
  popoverMenuOptions?: MenuOption[];
  onPopoverMenuClose?: () => void;
  alignTo?: 'left' | 'right';
};

export type SwipeableOptionRef = {
  playAnimation: () => void;
  showPopoverMenu: () => void;
};
