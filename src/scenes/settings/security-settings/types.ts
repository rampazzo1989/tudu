import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParamList } from '../../../navigation/stack-navigator/types';

export interface SecuritySettingsPageProps {
  navigation: StackNavigationProp<
    StackNavigatorParamList,
    'SecuritySettings'
  >;
}
