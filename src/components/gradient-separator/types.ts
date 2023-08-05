import {LinearGradientProps} from 'react-native-linear-gradient';

export interface GradientSeparatorProps
  extends Omit<LinearGradientProps, 'colors'> {
  colorArray: string[];
  marginTop?: number;
}
