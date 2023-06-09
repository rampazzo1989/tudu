import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AnimatedIconProps} from '../../components/animated-icons/animated-icon/types';
import {StackNavigatorParamList} from '../../navigation/stack-navigator/types';

type HomePageProps = NativeStackScreenProps<StackNavigatorParamList, 'Home'>;

export type {HomePageProps};

export type List = {
  icon: React.FC<AnimatedIconProps>;
  label: string;
  isHighlighted: boolean;
  numberOfActiveItems: number;
};
