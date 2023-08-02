import {StyleProp, ViewStyle} from 'react-native/types';
import {AnimatedIconProps} from '../animated-icons/animated-icon/types';

export type ListCardProps = {
  label: string;
  Icon: React.FC<AnimatedIconProps>;
  numberOfActiveItems: number;
  isHighlighted?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

export type NumberOfActiveItemsProps = Pick<
  ListCardProps,
  'numberOfActiveItems' | 'isHighlighted'
>;
