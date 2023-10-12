import {TuduItem} from '../../scenes/home/types';

export type TuduCardProps = {
  data: TuduItem;
  onPress: (tudu: TuduItem) => void;
};
