import {AnimatedIconProps} from '../animated-icons/animated-icon/types';
import {BlurredModalProps} from '../blurred-modal/types';

export type PopupButton = {
  label: string;
  onPress: () => void;
  highlight?: boolean;
};

export type PopupModalProps = BlurredModalProps & {
  title?: string;
  buttons?: PopupButton[];
  Icon?: React.FC<AnimatedIconProps>;
};
