import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AnimatedIconProps,
  AnimatedIconRef,
} from '../../components/animated-icons/animated-icon/types';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type List = {
  label: string;
  numberOfActiveItems: number;
  id: string;
  color?: string;
  groupName?: string;
};

export type BuiltInList = List & {
  icon: React.ForwardRefExoticComponent<
    AnimatedIconProps & React.RefAttributes<AnimatedIconRef>
  >;
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
