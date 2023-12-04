import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {ListDataViewModel} from '../../types';

export type CustomListsProps = {
  onListPress: (listData: ListDataViewModel) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
