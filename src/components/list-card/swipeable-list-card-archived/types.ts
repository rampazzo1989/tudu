import {SwipeableCardRef} from '../../swipeable-card/types';

export type SwipeableListCardArchivedProps = {
  children: React.ReactNode;
  enabled?: boolean;
  onUnarchive: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};
