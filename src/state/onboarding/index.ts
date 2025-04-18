import { atom } from 'recoil';
import { mmkvPersistAtom } from '../../utils/state-utils/mmkv-persist-atom';

export const hasSeenOnboarding = atom<boolean>({
  key: 'hasSeenOnboarding',
  default: false,
  effects: [mmkvPersistAtom('hasSeenOnboarding')],
});