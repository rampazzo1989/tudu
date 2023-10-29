import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {ListViewModel} from '../../../home/types';

export type NewGroupModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingGroupData?: DraggableItem<ListViewModel>;
};
