import {ForwardedRefAnimatedIcon} from '../../../../components/animated-icons/animated-icon/types';
import {CounterViewModel} from '../../types';

export type CounterListProps = {
  list: CounterViewModel[];
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};
