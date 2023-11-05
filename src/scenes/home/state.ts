import i18next from 'i18next';
import {atom, selector} from 'recoil';
import {mmkvPersistAtom} from '../../utils/state-utils/mmkv-persist-atom';
import {Counter, SmartList, List, TuduItem} from './types';

export const homeDefaultLists = atom<SmartList[]>({
  key: 'homeDefaultLists',
  default: [
    {
      id: 'today',
      icon: 'today',
      label: i18next.t('listTitles.today'),
      isHighlighted: true,
      navigateToPage: 'ScheduledList',
    },
    {
      id: 'all lists',
      icon: 'default',
      label: i18next.t('listTitles.allTasks'),
      isHighlighted: false,
    },
    {
      id: 'archived',
      icon: 'archived',
      label: i18next.t('listTitles.archived'),
      isHighlighted: false,
      navigateToPage: 'Archived',
    },
    {
      id: 'starred',
      icon: 'star',
      label: i18next.t('listTitles.starred'),
      isHighlighted: false,
    },
  ],
});

export const counters = atom<Map<string, Counter>>({
  key: 'counters',
  default: new Map<string, Counter>([
    [
      '1',
      {
        id: '1',
        title: 'Glasses of water today',
        value: 8,
        pace: 1,
      },
    ],
    [
      '2',
      {
        id: '2',
        title: 'Money saved',
        value: 2400000,
        pace: 5,
      },
    ],
    [
      '3',
      {
        id: '3',
        title: 'Extra hours this week',
        value: 7,
        pace: 1,
      },
    ],
  ]),
  effects: [mmkvPersistAtom('counters', true)],
});

export const myLists = atom<Map<string, List>>({
  key: 'myLists',
  default: new Map<string, List>([
    [
      '1',
      {
        id: '1',
        label: 'Movies',
        color: 'green',
        numberOfActiveItems: 1,
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '2',
      {
        id: '2',
        label: 'Shop List',
        color: 'red',
        numberOfActiveItems: 3,
        groupName: 'Test',
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '3',
      {
        id: '3',
        label: 'Gift Ideias',
        color: '#7956BF',
        numberOfActiveItems: 12,
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '4',
      {
        id: '4',
        label: 'America',
        color: 'red',
        numberOfActiveItems: 10,
        groupName: 'Travel',
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '5',
      {
        id: '5',
        label: 'Europe',
        color: 'blue',
        numberOfActiveItems: 12,
        groupName: 'Travel',
        tudus: new Map<string, TuduItem>(),
      },
    ],
  ]),
  effects: [mmkvPersistAtom('myLists', true)],
});

export const archivedLists = atom<Map<string, List>>({
  key: 'archivedLists',
  default: new Map<string, List>(),
  effects: [mmkvPersistAtom('archivedLists', true)],
});
