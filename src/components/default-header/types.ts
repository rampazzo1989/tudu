import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type DefaultHeaderProps = {
  title?: string;
  Icon: ForwardedRefAnimatedIcon;
  onBackButtonPress: () => void;
};
