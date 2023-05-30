import {atom} from 'recoil';
import {List} from './types';

export const homeDefaultLists = atom<List[]>({
  key: 'homeDefaultLists',
  default: [
    {
      icon: 'today',
      label: 'Today',
      isHighlighted: true,
      numberOfActiveItems: 0,
    },
    {
      icon: 'tasks',
      label: 'All tasks',
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
    {
      icon: 'starred',
      label: 'Starred',
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
  ],
});
