import {ListViewModel} from '../../../home/types';

export type NewListModalProps = {
  visible: boolean;
  editingList?: ListViewModel;
  onRequestClose: () => void;
};
