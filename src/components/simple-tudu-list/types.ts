import {TuduViewModel} from '../../scenes/home/types';
import {TuduAdditionalInformation} from '../tudu-card/types';

export type SimpleTuduListProps = {
  onTuduPress: (tudu: TuduViewModel) => void;
  getAdditionalInformation: (
    tudu: TuduViewModel,
  ) => TuduAdditionalInformation | undefined;
};
