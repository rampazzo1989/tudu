import {AnimatedIconProps} from '../animated-icons/animated-icon/types';
import {BlurredModalProps} from '../blurred-modal/types';

export type PopupButton = {
  label: string;
  onPress: () => void;
  highlight?: boolean;
  disabled?: boolean;
};

export type PopupModalProps = BlurredModalProps & {
  title?: string;
  buttons?: PopupButton[];
  Icon?: React.FC<AnimatedIconProps>;
  shakeOnShow?: boolean;
  haptics?: boolean;
  topContainerVisible?: boolean;
  TopContainerComponent?: React.ReactNode;
};
