import { ViewStyle } from 'react-native';
import {SwipeableCardRef} from '../../swipeable-card/types';

export type SwipeableListCardProps = {
  children: React.ReactNode;
  isHighlighted: boolean;
  enabled?: boolean;
  onArchive: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  style?: ViewStyle;
};
