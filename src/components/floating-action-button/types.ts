import {
  AnimatedIconProps,
  BaseAnimatedIconRef,
} from '../animated-icons/animated-icon/types';
import {MenuOption} from '../menu-options/types';

export type FloatingActionButtonProps = {
  menuOptions: MenuOption[];
  DefaultIcon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
  >;
  animationMode?: 'play' | 'toggle';
};

export type FloatingActionButtonRef = {
  animateThisIcon: (
    Icon: React.ForwardRefExoticComponent<
      AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
    >,
  ) => void;
};
