import {CounterViewModel} from '../../../home/types';

export type CounterOptionsProps = {
  counterData: CounterViewModel;
  closeMenu: () => void;
  onEditOption: () => void;
  onDeleteOption: () => void;
};
