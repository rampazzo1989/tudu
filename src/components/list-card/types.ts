import {StyleProp, ViewStyle} from 'react-native/types';

export type ListCardProps = {
  label: string;
  icon: string;
  numberOfActiveItems: number;
  isHighlighted?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type NumberOfActiveItemsProps = Pick<
  ListCardProps,
  'numberOfActiveItems' | 'isHighlighted'
>;
