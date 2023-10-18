import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {TuduItem} from '../../../home/types';

export type TudusListProps = {
  onTuduPress: (tudu: TuduItem) => void;
  onEditPress: (tudu: TuduItem) => void;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
