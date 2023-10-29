import {DraggableItem} from '../../../../../../modules/draggable/draggable-context/types';
import {ListViewModel} from '../../../../types';

export type GroupOptionsProps = {
  groupData: DraggableItem<ListViewModel>;
  closeMenu: () => void;
  onRename: () => void;
  onDeleteCallback?: () => void;
};
