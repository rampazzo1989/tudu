import i18next from 'i18next';
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
      label: i18next.t('listTitles.today'),
      isHighlighted: true,
      numberOfActiveItems: 0,
    },
    {
      icon: ListDefaultIcon,
      label: i18next.t('listTitles.allTasks'),
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
    {
      icon: StarIcon,
      label: i18next.t('listTitles.starred'),
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
  ],
});
