import {List} from '../../../home/types';

export type ArchivedListsProps = {
  data: List[];
  onListPress: (listData: List) => void;
};
