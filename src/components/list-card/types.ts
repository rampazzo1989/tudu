import {StyleProp, ViewStyle} from 'react-native/types';
import {AnimatedIconProps} from '../animated-icons/animated-icon/types';
import {SwipeableCardRef} from '../swipeable-card/types';

export type ListCardProps = {
  label: string;
  Icon: React.FC<AnimatedIconProps>;
  numberOfActiveItems: number;
  isHighlighted?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
  onPress?: () => void;
  ControlComponent?: React.ReactNode;
  showNumberOfActiveItems?: boolean;
};

export type EditableListCardProps = ListCardProps & {
  swipeEnabled?: boolean;
  onArchive: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  onEdit: () => void;
};

export type ArchivedListCardProps = ListCardProps & {
  swipeEnabled?: boolean;
  onUnarchive: () => void;
  onDelete: (swipeableRef: React.RefObject<SwipeableCardRef>) => void;
};

export type NumberOfActiveItemsProps = Pick<
  ListCardProps,
  'numberOfActiveItems' | 'isHighlighted'
>;
