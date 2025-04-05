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
  onStarPress: (tudu: TuduViewModel) => void;
  additionalInfo?: TuduAdditionalInformation;
};
