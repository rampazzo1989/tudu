import {TuduViewModel} from '../../scenes/home/types';

export type NewTuduModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onInsertOrUpdate: (tudu: TuduViewModel) => void;
  editingTudu?: TuduViewModel;
  listName?: string;
};
