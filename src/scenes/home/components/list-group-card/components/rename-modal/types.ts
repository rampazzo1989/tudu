import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {ListDataViewModel} from '../../../../types';

export type RenameModalProps = {
  visible: boolean;
  groupData: DraggableItem<ListDataViewModel>;
  onRequestClose: () => void;
};
