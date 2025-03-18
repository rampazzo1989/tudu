import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';
import {MenuOption} from '../menu-options/types';

export type FloatingActionButtonProps = {
  DefaultIcon: ForwardedRefAnimatedIcon;
  animationMode?: 'play' | 'toggle';
  menuOptions?: MenuOption[];
  animateOnPress?: boolean;
  onPress?: () => void;
};

export type FloatingActionButtonRef = {
  animateThisIcon: (Icon: ForwardedRefAnimatedIcon | string) => void;
  closeMenu: () => void;
};
