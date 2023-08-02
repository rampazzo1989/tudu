import {DraggableItem} from '../../modules/draggable/draggable-context/types';

export type FloatingDeleteProps = {
  visible: boolean;
  confirmationPopupTitleBuilder: (item?: DraggableItem<unknown>) => string;
};
