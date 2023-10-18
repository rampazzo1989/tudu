import {TuduItem} from '../../scenes/home/types';
import {SwipeableCardRef} from '../swipeable-card/types';

export type TuduCardProps = {
  data: TuduItem;
  onPress: (tudu: TuduItem) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};
