import { atom } from 'recoil';
import { mmkvPersistAtom } from '../../utils/state-utils/mmkv-persist-atom';

export const hasSeenOnboarding = atom<boolean>({
  key: 'hasSeenOnboarding',
  default: false,
  effects: [mmkvPersistAtom('hasSeenOnboarding')],
});

export const hasSeenHomeTour = atom<boolean>({
  key: 'hasSeenHomeTour',
  default: false,
  effects: [mmkvPersistAtom('hasSeenHomeTour')],
});

export const hasSeenListTour = atom<boolean>({
  key: 'hasSeenListTour',
  default: false,
  effects: [mmkvPersistAtom('hasSeenListTour')],
});