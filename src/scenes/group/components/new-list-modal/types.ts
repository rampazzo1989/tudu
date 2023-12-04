import {ListDataViewModel} from '../../../home/types';

export type NewListModalProps = {
  visible: boolean;
  editingList?: ListDataViewModel;
  onRequestClose: () => void;
};
