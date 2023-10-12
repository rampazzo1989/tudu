import {MMKV} from 'react-native-mmkv';
import {AtomEffect, DefaultValue} from 'recoil';

const storage = new MMKV();

const mmkvPersistAtom: (key: string) => AtomEffect<any> =
  key =>
  ({setSelf, onSet}) => {
    setSelf(() => {
      let data = storage.getString(key);
      if (data != null) {
        return JSON.parse(data);
      } else {
        return new DefaultValue();
      }
    });

    onSet((newValue, _, isReset) => {
      if (isReset) {
        storage.delete(key);
      } else {
        storage.set(key, JSON.stringify(newValue));
      }
    });
  };

export {mmkvPersistAtom};
