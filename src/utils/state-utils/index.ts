import {SetterOrUpdater} from 'recoil';

export const toggle = (x: boolean) => !x;

export const syncToStorage = <T>(listSetter: SetterOrUpdater<T[]>) => {
  listSetter(x => [...x]);
};
