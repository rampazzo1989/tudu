import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {TuduViewModel} from '../../../home/types';

export type TudusListProps = {
  onTuduPress: (tudu: TuduViewModel) => void;
  onEditPress: (tudu: TuduViewModel) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
