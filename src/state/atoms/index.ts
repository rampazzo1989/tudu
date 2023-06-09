import {atom} from 'recoil';
import {IdlyAnimatedComponent} from './types';

export const idlyAnimatedComponents = atom<IdlyAnimatedComponent[]>({
  key: 'idlyAnimatedComponents',
  default: [],
});
