import {Counter} from '../../../home/types';

export type NewCounterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingCounterData?: Counter;
  onInsertNewCounter?: () => void;
};
