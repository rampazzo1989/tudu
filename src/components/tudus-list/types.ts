import {ListViewModel, TuduViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';
import {TuduAdditionalInformation} from '../tudu-card/types';

export type TudusListProps = {
  onTuduPress: (tudu: TuduViewModel) => void;
  onEditPress: (tudu: TuduViewModel) => void;
  onDeletePress: (tudu: TuduViewModel) => void;
  onClearAllDonePress: (doneTudus: TuduViewModel[]) => void;
  onUndoAllPress: (doneTudus: TuduViewModel[]) => void;
  onStarPress: (tudu: TuduViewModel) => void;
  setTudus: (tudus: TuduViewModel[]) => void;
  getAdditionalInformation: (
    tudu: TuduViewModel,
  ) => TuduAdditionalInformation | undefined;
  list?: ListViewModel;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon | string) => void;
  TopComponent?: React.ReactNode;
};
