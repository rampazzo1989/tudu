import {Counter} from '../../../home/types';

export type CounterOptionsProps = {
  counterData: Counter;
  closeMenu: () => void;
  onEditOption: () => void;
  onDeleteOption: () => void;
};
