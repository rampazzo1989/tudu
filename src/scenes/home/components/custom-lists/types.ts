import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {List} from '../../types';

export type CustomListsProps = {
  data: DraggableItem<List>[];
  onListPress: (listData: List) => void;
};
