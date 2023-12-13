import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type FloatingDeleteProps = {
  visible: boolean;
  confirmationPopupTitleBuilder: (item?: any) => string;
  deleteItemsFn: (item: any) => void;
  undoDeletionFn: () => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
