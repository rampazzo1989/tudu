import {ListOrigin, ListViewModel, TuduViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type ListPageCoreProps = {
  setTudus: (tudus: TuduViewModel[]) => void;
  handleBackButtonPress: () => void;
  list?: ListViewModel;
  onUpdateList?: (list: ListViewModel) => void;
  Icon?: ForwardedRefAnimatedIcon;
  isSmartList?: boolean;
  allowAdding?: boolean;
  numberOfUndoneTudus?: number;
  TopComponent?: React.ReactNode;
  defaultDueDate?: Date;
  defaultListId?: string;
  defaultOrigin?: ListOrigin;
};
