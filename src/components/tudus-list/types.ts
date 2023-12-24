import {TuduViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';
import {TuduAdditionalInformation} from '../tudu-card/types';

export type TudusListProps = {
  onTuduPress: (tudu: TuduViewModel) => void;
  onEditPress: (tudu: TuduViewModel) => void;
  onDeletePress: (tudu: TuduViewModel) => void;
  onStarPress: (tudu: TuduViewModel) => void;
  getAdditionalInformation: (
    tudu: TuduViewModel,
  ) => TuduAdditionalInformation | undefined;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
  draggableEnabled?: boolean;
};
