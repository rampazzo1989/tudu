import {TuduViewModel} from '../../scenes/home/types';
import {SwipeableCardRef} from '../swipeable-card/types';

export type TuduCardProps = {
  data: TuduViewModel;
  onPress: (tudu: TuduViewModel) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};
