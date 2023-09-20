import {AnimatedIconProps} from '../animated-icons/animated-icon/types';

export type MenuOption = {
  Icon: React.FC<AnimatedIconProps>;
  label: string;
  onPress: () => void;
};

export type MenuOptionsProps = {
  options: MenuOption[];
  closeMenu?: () => void;
};
