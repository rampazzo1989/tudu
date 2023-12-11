import {TuduViewModel} from '../../scenes/home/types';
import {TuduAdditionalInformation} from '../tudu-card/types';

export type SimpleTuduListProps = {
  getAdditionalInformation: (
    tudu: TuduViewModel,
  ) => TuduAdditionalInformation | undefined;
  tudus: TuduViewModel[];
  deleteTuduFn: (tudu: TuduViewModel) => void;
  updateTuduFn: (tudu: TuduViewModel) => void;
  undoDeletionFn: () => void;
  onEditPress: (tudu: TuduViewModel) => void;
};
