import {TuduViewModel} from '../../scenes/home/types';

export type NewTuduModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onInsertOrUpdate: (tudu: TuduViewModel) => void;
  onBatchInsert?: (labels: string[]) => void;
  editingTudu?: TuduViewModel;
  listName?: string;
  existingTasks?: string[];
  onOpenAISettings?: () => void;
};

