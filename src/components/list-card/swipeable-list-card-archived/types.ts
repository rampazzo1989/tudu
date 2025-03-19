import { ViewStyle } from 'react-native';
import {SwipeableCardRef} from '../../swipeable-card/types';

export type SwipeableListCardArchivedProps = {
  children: React.ReactNode;
  enabled?: boolean;
  style?: ViewStyle;
  onUnarchive: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};
