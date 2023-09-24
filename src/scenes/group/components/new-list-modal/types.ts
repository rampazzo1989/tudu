import {List} from '../../../home/types';

export type NewListModalProps = {
  visible: boolean;
  editingList?: List;
  onRequestClose: () => void;
};
