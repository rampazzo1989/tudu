import {atom} from 'recoil';

export const draggedItemHeight = atom<number>({
  key: 'draggedItemHeight',
  default: 50,
});
