import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';
import {ListIconType} from '../list/constants';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type TuduItem = {
  label: string;
  done: boolean;
  id: string;
};

// export type LinkedTuduItem = {
//   data: TuduItem;
//   listId: string;
//   origin: ListOrigin;
// };

export class LinkedTuduItem {
  data: TuduItem;
  listId: string;
  origin: ListOrigin;

  constructor(data: TuduItem, listId: string, origin: ListOrigin = 'default') {
    this.data = data;
    this.listId = listId;
    this.origin = origin;
  }
}

export type List = {
  label: string;
  numberOfActiveItems: number;
  id: string;
  tudus: Map<string, TuduItem>;
  color?: string;
  groupName?: string;
};

export type ListOrigin = 'archived' | 'default';

export class LinkedListItem {
  data: List;
  origin: ListOrigin;

  constructor(data: List, origin: ListOrigin = 'default') {
    this.data = data;
    this.origin = origin;
  }
}

export type BuiltInList = List & {
  icon: ListIconType;
  isHighlighted: boolean;
  navigateToPage?: keyof StackNavigatorParamList;
};

export type ListGroup = {
  title: string;
  lists: List[];
};

export type Counter = {
  title: string;
  value: number;
  pace: number;
};
