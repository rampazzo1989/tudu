import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ForwardedRefAnimatedIcon} from '../../components/animated-icons/animated-icon/types';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type TuduItem = {
  label: string;
  done: boolean;
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
  icon: ForwardedRefAnimatedIcon;
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
