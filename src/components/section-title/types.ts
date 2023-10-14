import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';

export interface SectionTitleProps extends ViewProps {
  title: string;
  ControlComponent?: React.ReactNode;
}
