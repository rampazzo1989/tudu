import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../animated-icons/animated-icon/types';
import {MenuOption} from '../menu-options/types';

export type SwipeableOption = {
  Icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
  onPress?: () => void;
  backgroundColor?: string;
  text?: string;
  popoverMenuOptions?: MenuOption[];
};

export type SwipeableCardProps = {
  children: React.ReactNode;
  backgroundColor: string;
  optionsBackgroundColor: string;
  leftOptions?: SwipeableOption[];
  rightOptions?: SwipeableOption[];
  enabled?: boolean;
  fullWidthOnLeftOptions?: boolean;
  fullWidthOnRightOptions?: boolean;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
};

export type SwipeableCardRef = {closeOptions: () => void};
