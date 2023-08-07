import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {List} from '../../../../types';

export type RenameModalProps = {
  visible: boolean;
  groupData: DraggableItem<List>;
  onRequestClose: () => void;
};
