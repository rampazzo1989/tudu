import i18next from 'i18next';
import {atom, selector} from 'recoil';
import {isToday} from '../../utils/date-utils';
import {mmkvPersistAtom} from '../../utils/state-utils/mmkv-persist-atom';
import {Counter, SmartList, List, TuduItem} from './types';

export const UNLISTED = 'unlisted';

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
      id: 'all',
      icon: 'default',
      label: i18next.t('listTitles.allTasks'),
      isHighlighted: false,
      navigateToPage: 'AllTudus',
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

export const unlistedTudusList = atom<List>({
  key: 'unlistedTudusList',
  default: {
    id: UNLISTED,
    label: 'Unlisted',
    tudus: new Map<string, TuduItem>(),
  } as List,
  effects: [mmkvPersistAtom('unlistedTudusList')],
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
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '2',
      {
        id: '2',
        label: 'Shop List',
        color: 'red',
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
        tudus: new Map<string, TuduItem>(),
      },
    ],
    [
      '4',
      {
        id: '4',
        label: 'America',
        color: 'red',
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

export const smartListsTuduCount = selector({
  key: 'smartListsTuduCount',
  get: ({get}) => {
    const lists = get(myLists);
    const {tudus: unlistedTudus} = get(unlistedTudusList);

    let todayCount = 0;
    let starredCount = 0;
    let allTudus = 0;

    lists.forEach(list => {
      const undoneTudus = [...list.tudus]
        .filter(([_, tudu]) => !tudu.done)
        .map(([_, tudu]) => tudu);

      allTudus += undoneTudus.length;

      todayCount += undoneTudus.filter(
        tudu => tudu.dueDate && isToday(tudu.dueDate),
      ).length;
    }, []);

    const undoneUnlistedTudus = [...unlistedTudus]
      .filter(([_, tudu]) => !tudu.done)
      .map(([_, tudu]) => tudu);

    allTudus += undoneUnlistedTudus.length;
    todayCount += undoneUnlistedTudus.filter(
      tudu => tudu.dueDate && isToday(tudu.dueDate),
    ).length;

    return {todayCount, starredCount, allTudus};
  },
});
