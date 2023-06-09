import {atom} from 'recoil';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {SunIcon} from '../../components/animated-icons/sun-icon';
import {List} from './types';

export const homeDefaultLists = atom<List[]>({
  key: 'homeDefaultLists',
  default: [
    {
      icon: SunIcon,
      label: 'Today',
      isHighlighted: true,
      numberOfActiveItems: 0,
    },
    {
      icon: ListDefaultIcon,
      label: 'All tasks',
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
    {
      icon: StarIcon,
      label: 'Starred',
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
  ],
});
