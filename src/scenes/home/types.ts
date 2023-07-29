import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AnimatedIconProps} from '../../components/animated-icons/animated-icon/types';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type List = {
  label: string;
  numberOfActiveItems: number;
  color?: string;
  groupName?: string;
};

export type BuiltInList = List & {
  icon: React.FC<AnimatedIconProps>;
  isHighlighted: boolean;
};

export type ListGroup = {
  title: string;
  lists: List[];
};

export type MyLists = {
  ungroupedLists: List[];
  groups: ListGroup[];
};

export type Counter = {
  title: string;
  value: number;
  format: 'general' | 'currency';
};
