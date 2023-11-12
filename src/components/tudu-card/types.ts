import {TuduViewModel} from '../../scenes/home/types';
import {SwipeableCardRef} from '../swipeable-card/types';

export type TuduAdditionalInformationOriginType =
  | 'list'
  | 'today'
  | 'scheduled';

export type TuduAdditionalInformation = {
  originType: TuduAdditionalInformationOriginType;
  label: string;
};

export type TuduCardProps = {
  data: TuduViewModel;
  onPress: (tudu: TuduViewModel) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onSendToOrRemoveFromToday: (
    swipeableRef: React.RefObject<SwipeableCardRef>,
  ) => void;
  additionalInfo?: TuduAdditionalInformation;
};
