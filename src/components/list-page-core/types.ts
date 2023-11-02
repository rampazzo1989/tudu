import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {ListViewModel, TuduViewModel} from '../../scenes/home/types';

export type ListPageCoreProps = {
  setTudus: (draggable: DraggableItem<TuduViewModel>[]) => void;
  handleBackButtonPress: () => void;
  list?: ListViewModel;
};
