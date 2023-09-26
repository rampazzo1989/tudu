import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {Counter} from '../../types';

export type CounterListProps = {
  list: Counter[];
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
