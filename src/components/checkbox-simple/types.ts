import {BaseAnimatedIconProps} from '../animated-icons/animated-icon/types';

export interface CheckboxSimpleProps extends BaseAnimatedIconProps {
  checked: boolean;
  onPress: () => void;
}
