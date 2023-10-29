import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {ListViewModel} from '../../types';

export type ListGroupProps = {
  groupData: DraggableItem<ListViewModel>;
  onListPress: (listData: ListViewModel) => void;
  handleEditListGenerator: (
    listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel,
  ) => () => void;
  handleArchiveGenerator: (
    listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel,
  ) => (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  handleDeleteGenerator: (
    listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel,
  ) => (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
