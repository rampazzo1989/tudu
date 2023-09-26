import {Counter} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type CounterTileProps = {
  counterData: Counter;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};

export type TileTitleProps = Pick<Counter, 'title'>;

export type CounterValueProps = Pick<Counter, 'value'>;

export type OptionsButtonProps = {
  counterData: Counter;
  onEditOption: () => void;
  onDeleteOption: () => void;
};

export type EditingCounterValueProps = CounterValueProps &
  Pick<OptionsButtonProps, 'onEditOption'>;

export type ActionButtonProps = {
  onAction: () => void;
};
