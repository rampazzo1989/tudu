import {ReactNode} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

export type TagChipVariant =
  | 'primary'
  | 'neutral'
  | 'today'
  | 'recurrence'
  | 'list';

export interface TagChipProps {
  label: string;
  Icon?: ReactNode;
  variant?: TagChipVariant;
  size?: 'small' | 'medium';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
