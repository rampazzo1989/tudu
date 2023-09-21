import {BuiltInList, List} from '../../../home/types';

export type ListHeaderProps = {
  listData?: BuiltInList | List;
  onBackButtonPress: () => void;
};
