import i18next from 'i18next';
import {atom, selector} from 'recoil';
import {isToday} from '../../utils/date-utils';
import {mmkvPersistAtom} from '../../utils/state-utils/mmkv-persist-atom';
import {
  Counter,
  SmartList,
  List,
  TuduItem,
  TuduItemMap,
  StateBackup,
} from './types';

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
      navigateToPage: 'StarredTudus',
    },
  ],
});

export const counters = atom<Map<string, Counter>>({
  key: 'counters',
  default: new Map<string, Counter>(),
  effects: [mmkvPersistAtom('counters', true)],
});

export const unlistedTudus = atom<TuduItemMap>({
  key: 'unlistedTudus',
  default: new Map<string, TuduItem>(),
  effects: [mmkvPersistAtom('unlistedTudus')],
});

export const myLists = atom<Map<string, List>>({
  key: 'myLists',
  default: new Map<string, List>([
    [
      '1',
      {
        id: '1',
        label: i18next.t('listTitles.sampleList'),
      },
    ],
  ]),
  effects: [mmkvPersistAtom('myLists', true)],
});

export const tudus = atom<Map<string, TuduItemMap>>({
  key: 'tudus',
  default: new Map<string, TuduItemMap>([
    [
      '1',
      new Map<string, TuduItem>([
        [
          '10',
          {
            id: '10',
            label: i18next.t('tuduSamples.checkThis'),
            done: false,
          },
        ],
        [
          '11',
          {
            id: '11',
            label: i18next.t('tuduSamples.swipeSidesOptions'),
            done: false,
          },
        ],
        [
          '12',
          {
            id: '12',
            label: i18next.t('tuduSamples.holdAndDragToReorder'),
            done: false,
          },
        ],
      ]),
    ],
  ]),
  effects: [mmkvPersistAtom('tudus')],
});

export const archivedTudus = atom<Map<string, TuduItemMap>>({
  key: 'archivedTudus',
  default: new Map<string, TuduItemMap>(),
  effects: [mmkvPersistAtom('archivedTudus')],
});

export const archivedLists = atom<Map<string, List>>({
  key: 'archivedLists',
  default: new Map<string, List>(),
  effects: [mmkvPersistAtom('archivedLists', true)],
});

export const smartListsTuduCount = selector({
  key: 'smartListsTuduCount',
  get: ({get}) => {
    const tuduMaps = get(tudus);
    const unlisted = get(unlistedTudus);

    let todayCount = 0;
    let starredCount = 0;
    let allTudus = 0;

    tuduMaps.forEach(map => {
      const undoneTudus = [...map]
        .filter(([_, tudu]) => !tudu.done)
        .map(([_, tudu]) => tudu);

      allTudus += undoneTudus.length;

      todayCount += undoneTudus.filter(
        tudu => tudu.dueDate && isToday(tudu.dueDate),
      ).length;

      starredCount += undoneTudus.filter(tudu => !!tudu.starred).length;
    }, []);

    const undoneUnlistedTudus = [...unlisted]
      .filter(([_, tudu]) => !tudu.done)
      .map(([_, tudu]) => tudu);

    allTudus += undoneUnlistedTudus.length;
    todayCount += undoneUnlistedTudus.filter(
      tudu => tudu.dueDate && isToday(tudu.dueDate),
    ).length;

    starredCount += undoneUnlistedTudus.filter(tudu => !!tudu.starred).length;

    return {todayCount, starredCount, allTudus};
  },
});
