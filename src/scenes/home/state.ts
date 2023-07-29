import i18next from 'i18next';
import {atom} from 'recoil';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {SunIcon} from '../../components/animated-icons/sun-icon';
import {Counter, BuiltInList, List, MyLists} from './types';

export const homeDefaultLists = atom<BuiltInList[]>({
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

export const counters = atom<Counter[]>({
  key: 'counters',
  default: [
    {
      title: 'Glasses of water today',
      value: 8,
      format: 'general',
    },
    {
      title: 'Money saved',
      value: 2400000,
      format: 'currency',
    },
    {
      title: 'Extra hours this week',
      value: 7,
      format: 'general',
    },
  ],
});

export const myLists = atom<List[]>({
  key: 'myLists',
  default: [
    {
      label: 'Movies',
      color: 'green',
      numberOfActiveItems: 1,
    },
    {
      label: 'Shop List',
      color: 'red',
      numberOfActiveItems: 3,
      groupName: 'Test',
    },
    {
      label: 'Gift Ideias',
      color: 'blue',
      numberOfActiveItems: 12,
    },
    {
      label: 'America',
      color: 'red',
      numberOfActiveItems: 10,
      groupName: 'Travel',
    },
    {
      label: 'Europe',
      color: 'blue',
      numberOfActiveItems: 12,
      groupName: 'Travel',
    },
  ],
});
