import {ListDataViewModel} from '../../../home/types';

export type ArchivedListsProps = {
  data: ListDataViewModel[];
  onListPress: (listData: ListDataViewModel) => void;
};
