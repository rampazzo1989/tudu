import {MMKV} from 'react-native-mmkv';
import {AtomEffect, DefaultValue} from 'recoil';

const storage = new MMKV();

function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

const mmkvPersistAtom: (key: string, isMap?: boolean) => AtomEffect<any> =
  (key, isMap) =>
  ({setSelf, onSet}) => {
    setSelf(() => {
      let data = storage.getString(key);
      if (data != null) {
        return isMap
          ? new Map(JSON.parse(data, reviver))
          : JSON.parse(data, reviver);
      } else {
        return new DefaultValue();
      }
    });

    onSet((newValue, _, isReset) => {
      const stringified = isMap
        ? JSON.stringify(newValue, replacer)
        : JSON.stringify(newValue, replacer);
      if (isReset) {
        storage.delete(key);
      } else {
        storage.set(key, stringified);
      }
    });
  };

export {mmkvPersistAtom};
