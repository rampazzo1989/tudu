import {TuduItem} from '../../../home/types';

export type NewTuduModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingTudu?: TuduItem;
};
