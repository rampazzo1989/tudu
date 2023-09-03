import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {List} from '../../../home/types';

export type NewGroupModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingGroupData?: DraggableItem<List>;
};
