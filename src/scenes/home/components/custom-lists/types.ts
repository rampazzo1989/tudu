import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {List} from '../../types';

export type CustomListsProps = {
  onListPress: (listData: List) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
