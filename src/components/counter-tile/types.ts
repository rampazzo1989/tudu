import {CounterViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type CounterTileProps = {
  counterData: CounterViewModel;
  animateIcon?: (Icon: ForwardedRefAnimatedIcon) => void;
};

export type TileTitleProps = Pick<CounterViewModel, 'title'>;

export type CounterValueProps = Pick<CounterViewModel, 'value'>;

export type OptionsButtonProps = {
  counterData: CounterViewModel;
  onEditOption: () => void;
  onDeleteOption: () => void;
};

export type EditingCounterValueProps = CounterValueProps &
  Pick<OptionsButtonProps, 'onEditOption'>;

export type ActionButtonProps = {
  onAction: () => void;
};
