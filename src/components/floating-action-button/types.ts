import {
  AnimatedIconProps,
  BaseAnimatedIconRef,
} from '../animated-icons/animated-icon/types';

export type FloatingActionButtonProps = {
  DefaultIcon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
  >;
};

export type FloatingActionButtonRef = {
  animateThisIcon: (
    Icon: React.ForwardRefExoticComponent<
      AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
    >,
  ) => void;
};
