import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParamList } from '../../../navigation/stack-navigator/types';

export type SubscriptionSettingsNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'SubscriptionSettings'
>;

export interface SubscriptionSettingsProps {
  navigation: SubscriptionSettingsNavigationProp;
}
