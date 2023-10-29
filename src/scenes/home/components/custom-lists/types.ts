import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {ListViewModel} from '../../types';

export type CustomListsProps = {
  onListPress: (listData: ListViewModel) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
