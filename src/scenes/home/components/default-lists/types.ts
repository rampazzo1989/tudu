import {BuiltInList} from '../../types';

export type DefaultListsProps = {
  lists: BuiltInList[];
  onListPress: (listData: BuiltInList) => void;
};
