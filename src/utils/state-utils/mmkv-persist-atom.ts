import { AppState } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { AtomEffect, DefaultValue } from 'recoil';

const storage = new MMKV();

const pendingWrites = new Map<string, () => void>();
const persistTimers = new Map<string, NodeJS.Timeout>();

AppState.addEventListener('change', state => {
  if (state === 'background' || state === 'inactive') {
    pendingWrites.forEach(flush => flush());
    pendingWrites.clear();
    persistTimers.forEach(timer => clearTimeout(timer));
    persistTimers.clear();
  }
});

function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
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

const mmkvPersistAtom: (key: string, isMap?: boolean, debounceMs?: number) => AtomEffect<any> =
  (key, isMap, debounceMs = 0) =>
  ({ setSelf, onSet }) => {
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
      if (isReset) {
        const existingTimer = persistTimers.get(key);
        if (existingTimer) {
          clearTimeout(existingTimer);
          persistTimers.delete(key);
        }
        pendingWrites.delete(key);
        storage.delete(key);
        return;
      }

      const write = () => {
        try {
          const stringified = JSON.stringify(newValue, replacer);
          storage.set(key, stringified);
        } catch (e) {
          console.warn(`[mmkvPersistAtom] Error serializing ${key}:`, e);
        }
        pendingWrites.delete(key);
        persistTimers.delete(key);
      };

      if (debounceMs > 0) {
        pendingWrites.set(key, write);
        const existingTimer = persistTimers.get(key);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
        const timer = setTimeout(write, debounceMs);
        persistTimers.set(key, timer);
      } else {
        write();
      }
    });
  };

export { mmkvPersistAtom };
