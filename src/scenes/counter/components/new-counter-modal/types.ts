import {CounterViewModel} from '../../../home/types';

export type NewCounterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingCounterData?: CounterViewModel;
  onInsertNewCounter?: () => void;
};
