import {TuduViewModel} from '../../../home/types';

export type NewTuduModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  editingTudu?: TuduViewModel;
};
