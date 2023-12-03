import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {ListDataViewModel} from '../../types';

export type ListGroupProps = {
  groupData: DraggableItem<ListDataViewModel>;
  onListPress: (listData: ListDataViewModel) => void;
  handleEditListGenerator: (
    listOrDraggableList: DraggableItem<ListDataViewModel> | ListDataViewModel,
  ) => () => void;
  handleArchiveGenerator: (
    listOrDraggableList: DraggableItem<ListDataViewModel> | ListDataViewModel,
  ) => (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  handleDeleteGenerator: (
    listOrDraggableList: DraggableItem<ListDataViewModel> | ListDataViewModel,
  ) => (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
