import {
  AnimatedIconProps,
  BaseAnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../animated-icons/animated-icon/types';
import {MenuOption} from '../menu-options/types';

export type FloatingActionButtonProps = {
  menuOptions: MenuOption[];
  DefaultIcon: ForwardedRefAnimatedIcon;
  animationMode?: 'play' | 'toggle';
};

export type FloatingActionButtonRef = {
  animateThisIcon: (Icon: ForwardedRefAnimatedIcon) => void;
  closeMenu: () => void;
};
