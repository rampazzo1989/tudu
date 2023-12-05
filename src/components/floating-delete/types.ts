import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type FloatingDeleteProps = {
  visible: boolean;
  confirmationPopupTitleBuilder: (item?: any) => string;
  deleteItemFn: (item: any) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
