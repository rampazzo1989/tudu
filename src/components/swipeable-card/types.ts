import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../animated-icons/animated-icon/types';

export type SwipeableOption = {
  Icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
  onPress: () => void;
  backgroundColor?: string;
  text?: string;
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
};
