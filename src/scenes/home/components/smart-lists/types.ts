import {SmartList} from '../../types';

export type DefaultListsProps = {
  lists: SmartList[];
  onListPress: (listData: SmartList, numberOfUndoneTudus?: number) => void;
};
