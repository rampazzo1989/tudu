import {SwipeableCardRef} from '../../swipeable-card/types';

export type SwipeableTuduCardProps = {
  children: React.ReactNode;
  done: boolean;
  onSendOrRemoveFromToday: (
    swipeableRef: React.RefObject<SwipeableCardRef>,
  ) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};
