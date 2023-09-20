import i18next from 'i18next';
import ReactNativeRecoilPersist from 'react-native-recoil-persist';
import {atom, selector} from 'recoil';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {MoonIcon} from '../../components/animated-icons/moon-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {SunIcon} from '../../components/animated-icons/sun-icon';
import {Counter, BuiltInList, List} from './types';

const getDaytimeIcon = () => {
  const currentTime = new Date();

  const sunsetTime = new Date();
  sunsetTime.setHours(18);
  sunsetTime.setMinutes(30); // Assuming sunset is at 6:30 PM

  const sunriseTime = new Date();
  sunriseTime.setHours(6);
  sunriseTime.setMinutes(0); // Assuming sunrise is at 6 AM

  return currentTime >= sunsetTime || currentTime < sunriseTime
    ? MoonIcon
    : SunIcon;
};

export const homeDefaultLists = atom<BuiltInList[]>({
  key: 'homeDefaultLists',
  default: [
    {
      icon: getDaytimeIcon(),
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
  // effects: [ReactNativeRecoilPersist.persistAtom],
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
  effects: [ReactNativeRecoilPersist.persistAtom],
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
      color: '#7956BF',
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
  effects: [ReactNativeRecoilPersist.persistAtom],
});

export const archivedLists = atom<List[]>({
  key: 'archivedLists',
  default: [],
  effects: [ReactNativeRecoilPersist.persistAtom],
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

      return (
        selectedListFromDefault ??
        myListsData.find(list => list.label === label)
      );
    },
});
