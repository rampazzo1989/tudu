import {StyleProp, ViewStyle} from 'react-native';
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
  onSchedulePress: (tudu: TuduViewModel) => void;
  virtualized?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
};
