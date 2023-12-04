import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {ListViewModel, TuduViewModel} from '../../scenes/home/types';
import {ForwardedRefAnimatedIcon} from '../animated-icons/animated-icon/types';

export type ListPageCoreProps = {
  setTudus: (draggable: DraggableItem<TuduViewModel>[]) => void;
  handleBackButtonPress: () => void;
  list?: ListViewModel;
  Icon?: ForwardedRefAnimatedIcon;
  loading?: boolean;
  isSmartList?: boolean;
  draggableEnabled?: boolean;
  allowAdding?: boolean;
  showScheduleInformation?: boolean;
};
