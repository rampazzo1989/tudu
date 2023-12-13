import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {ListDataViewModel} from '../../../../types';

export type GroupOptionsProps = {
  groupData: DraggableItem<ListDataViewModel>;
  closeMenu: () => void;
  onRename: () => void;
  onDelete: () => void;
  onUndoDeletion: () => void;
};
