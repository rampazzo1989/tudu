import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../animated-icons/animated-icon/types';

export type DefaultHeaderProps = {
  title?: string;
  Icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
  onBackButtonPress: () => void;
};
