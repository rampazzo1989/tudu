import {BuiltInList, List} from '../../types';

export type DefaultListsProps = {
  lists: BuiltInList[];
  onListPress: (listData: List) => void;
};
