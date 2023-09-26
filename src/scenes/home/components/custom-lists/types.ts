import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {List} from '../../types';

export type CustomListsProps = {
  data: DraggableItem<List>[];
  onListPress: (listData: List) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
