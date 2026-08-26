import { StyleProp, ViewStyle } from 'react-native';

export type GoogleCalendarOptionProps = {
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};
