import i18next from 'i18next';
import {atom, selector} from 'recoil';
import {mmkvPersistAtom} from '../../utils/state-utils/mmkv-persist-atom';
import {Counter, BuiltInList, List} from './types';

export const homeDefaultLists = atom<BuiltInList[]>({
  key: 'homeDefaultLists',
  default: [
    {
      id: 'todayList',
      icon: 'today',
      label: i18next.t('listTitles.today'),
      isHighlighted: true,
      numberOfActiveItems: 0,
      tudus: [
        {label: 'Do 50 pushups', done: false},
        {label: 'Do 30 situps', done: false},
        {label: 'Do 20 abs', done: false},
        {label: 'Do 40 lombar abs', done: false},
        {
          label:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed viverra nunc. Praesent lobortis arcu augue, sit amet luctus magna congue eu. Nullam interdum nulla sed consectetur eleifend. Donec pretium sem dui, non semper turpis cursus eget. Proin vel arcu libero. Vestibulum mattis lacus leo, eu suscipit sem molestie a. ',
          done: false,
        },
      ],
    },
    {
      id: 'allTasksList',
      icon: 'default',
      label: i18next.t('listTitles.allTasks'),
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
    {
      id: 'archivedListsList',
      icon: 'archived',
      label: i18next.t('listTitles.archived'),
      isHighlighted: false,
      numberOfActiveItems: 0,
      navigateToPage: 'Archived',
    },
    {
      id: 'starredList',
      icon: 'star',
      label: i18next.t('listTitles.starred'),
      isHighlighted: false,
      numberOfActiveItems: 0,
    },
  ],
  dangerouslyAllowMutability: true,
  effects: [mmkvPersistAtom('homeDefaultLists')],
});

export const counters = atom<Counter[]>({
  key: 'counters',
  default: [
    {
      title: 'Glasses of water today',
      value: 8,
      pace: 1,
    },
    {
      title: 'Money saved',
      value: 2400000,
      pace: 5,
    },
    {
      title: 'Extra hours this week',
      value: 7,
      pace: 1,
    },
  ],
  effects: [mmkvPersistAtom('counters')],
});

export const myLists = atom<List[]>({
  key: 'myLists',
  default: [
    {
      id: '1',
      label: 'Movies',
      color: 'green',
      numberOfActiveItems: 1,
    },
    {
      id: '2',
      label: 'Shop List',
      color: 'red',
      numberOfActiveItems: 3,
      groupName: 'Test',
    },
    {
      id: '3',
      label: 'Gift Ideias',
      color: '#7956BF',
      numberOfActiveItems: 12,
    },
    {
      id: '4',
      label: 'America',
      color: 'red',
      numberOfActiveItems: 10,
      groupName: 'Travel',
    },
    {
      id: '5',
      label: 'Europe',
      color: 'blue',
      numberOfActiveItems: 12,
      groupName: 'Travel',
    },
  ],
  effects: [mmkvPersistAtom('myLists')],
});

export const archivedLists = atom<List[]>({
  key: 'archivedLists',
  default: [],
  effects: [mmkvPersistAtom('archivedLists')],
});

export const getListByLabel = selector({
  key: 'getObjectByLabel',
  get:
    ({get}) =>
    (label: string) => {
      const defaultLists = get(homeDefaultLists);
      const myListsData = get(myLists);

      const selectedListFromDefault = defaultLists.find(
        list => list.label === label,
      );

      if (selectedListFromDefault) {
        return selectedListFromDefault;
      }

      return myListsData.find(list => list.label === label);
    },
});
