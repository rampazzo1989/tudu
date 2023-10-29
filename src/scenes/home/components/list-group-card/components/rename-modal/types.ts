import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {ListViewModel} from '../../../../types';

export type RenameModalProps = {
  visible: boolean;
  groupData: DraggableItem<ListViewModel>;
  onRequestClose: () => void;
};
