import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {List} from '../../types';

export type ListGroupProps = {
  groupData: DraggableItem<List>;
  onListPress: (listData: List) => void;
  handleEditListGenerator: (
    listOrDraggableList: DraggableItem<List> | List,
  ) => () => void;
  handleArchiveGenerator: (
    listOrDraggableList: DraggableItem<List> | List,
  ) => (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  handleDeleteGenerator: (
    listOrDraggableList: DraggableItem<List> | List,
  ) => () => void;
};
