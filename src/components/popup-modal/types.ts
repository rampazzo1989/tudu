import {BlurredModalProps} from '../blurred-modal/types';

export type PopupButton = {
  label: string;
  onPress: () => void;
  highlight?: boolean;
};

export type PopupModalProps = BlurredModalProps & {
  title?: string;
  buttons?: PopupButton[];
};
