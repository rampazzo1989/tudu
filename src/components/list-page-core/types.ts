import {ListViewModel, TuduViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type ListPageCoreProps = {
  setTudus: (tudus: TuduViewModel[]) => void;
  handleBackButtonPress: () => void;
  list?: ListViewModel;
  Icon?: ForwardedRefAnimatedIcon;
  isSmartList?: boolean;
  draggableEnabled?: boolean;
  allowAdding?: boolean;
  numberOfUndoneTudus?: number;
  TopComponent?: React.ReactNode;
};
