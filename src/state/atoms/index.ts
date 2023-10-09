import {atom} from 'recoil';
import {IdlyAnimatedComponent} from './types';
import React from 'react';
import {Swipeable} from 'react-native-gesture-handler';

export const idlyAnimatedComponents = atom<IdlyAnimatedComponent[]>({
  key: 'idlyAnimatedComponents',
  default: [],
});

export const currentlyOpenSwipeableRef = atom<React.RefObject<Swipeable>>({
  key: 'currentlyOpenSwipeableRef',
  default: undefined,
  dangerouslyAllowMutability: true,
});
