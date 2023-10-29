import {ListViewModel} from '../../../home/types';

export type ArchivedListsProps = {
  data: ListViewModel[];
  onListPress: (listData: ListViewModel) => void;
};
