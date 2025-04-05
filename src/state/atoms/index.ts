import {atom} from 'recoil';
import {IdlyAnimatedComponent} from './types';
import React from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import { mmkvPersistAtom } from '../../utils/state-utils/mmkv-persist-atom';

export const idlyAnimatedComponents = atom<IdlyAnimatedComponent[]>({
  key: 'idlyAnimatedComponents',
  default: [],
});

export const currentlyOpenSwipeableRef = atom<React.RefObject<Swipeable>>({
  key: 'currentlyOpenSwipeableRef',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const toastSpan = atom<number>({
  key: 'toastSpan',
  default: 0,
});

export const emojiUsageState = atom<Map<string, number>>({
  key: 'emojiUsageState',
  default: new Map<string, number>(),
  effects: [mmkvPersistAtom('emojiUsageState', true)],
});

export const showOutdatedTudus = atom<boolean>({
  key: 'showOutdatedTudus',
  default: false,
});
