import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type FloatingDeleteProps = {
  visible: boolean;
  confirmationPopupTitleBuilder: (item?: any) => string;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
