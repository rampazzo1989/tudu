import i18next from 'i18next';
import {atom, selector} from 'recoil';
import {isToday, isFutureDate} from '../../utils/date-utils';
import {mmkvPersistAtom} from '../../utils/state-utils/mmkv-persist-atom';
import {
  Counter,
  SmartList,
  List,
  TuduItem,
  TuduItemMap,
  StateBackup,
} from './types';

export const UNLISTED_LIST_ID = 'unlisted';

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
      id: 'upcoming',
      icon: 'calendar',
      label: i18next.t('listTitles.upcoming'),
      isHighlighted: false,
      navigateToPage: 'UpcomingTudus',
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
  effects: [mmkvPersistAtom('unlistedTudus', false, 250)],
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
  effects: [mmkvPersistAtom('tudus', false, 250)],
});

export const archivedTudus = atom<Map<string, TuduItemMap>>({
  key: 'archivedTudus',
  default: new Map<string, TuduItemMap>(),
  effects: [mmkvPersistAtom('archivedTudus', false, 250)],
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
    let upcomingCount = 0;
    let starredCount = 0;
    let allTudus = 0;

    for (const map of tuduMaps.values()) {
      if (!map) {
        continue;
      }
      for (const tudu of map.values()) {
        if (!tudu || tudu.done) {
          continue;
        }
        allTudus++;

        if (tudu.dueDate) {
          if (isToday(tudu.dueDate)) {
            todayCount++;
          } else if (isFutureDate(tudu.dueDate)) {
            upcomingCount++;
          }
        }

        if (tudu.starred) {
          starredCount++;
        }
      }
    }

    if (unlisted) {
      for (const tudu of unlisted.values()) {
        if (!tudu || tudu.done) {
          continue;
        }
        allTudus++;

        if (tudu.dueDate) {
          if (isToday(tudu.dueDate)) {
            todayCount++;
          } else if (isFutureDate(tudu.dueDate)) {
            upcomingCount++;
          }
        }

        if (tudu.starred) {
          starredCount++;
        }
      }
    }

    return {todayCount, upcomingCount, starredCount, allTudus};
  },
});

export const hasTudusState = selector({
  key: 'hasTudusState',
  get: ({get}) => {
    const custom = get(tudus);
    if (custom.size > 0) {
      for (const map of custom.values()) {
        if (map && map.size > 0) {
          return true;
        }
      }
    }
    const unlisted = get(unlistedTudus);
    return Boolean(unlisted && unlisted.size > 0);
  },
});

