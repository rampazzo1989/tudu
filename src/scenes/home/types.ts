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

export type List = {
  label: string;
  numberOfActiveItems: number;
  id: string;
  tudus?: TuduItem[];
  color?: string;
  groupName?: string;
};

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
