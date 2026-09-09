import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  myLists,
  tudus as tudusState,
  unlistedTudus as unlistedTudusState,
  UNLISTED_LIST_ID,
} from '../../scenes/home/state';

export const DataIntegritySync: React.FC = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [customTudus, setCustomTudus] = useRecoilState(tudusState);
  const [unlisted, setUnlisted] = useRecoilState(unlistedTudusState);

  useEffect(() => {
    let hasCorruptedScheduled = false;
    if (customLists.has('scheduled')) {
      hasCorruptedScheduled = true;
    }
    if (customTudus.has('scheduled')) {
      hasCorruptedScheduled = true;
    }

    const customIds = new Set<string>();
    customTudus.forEach((map, listId) => {
      if (listId !== 'scheduled' && listId !== UNLISTED_LIST_ID) {
        map.forEach((_, id) => customIds.add(id));
      }
    });

    const duplicateIdsInUnlisted: string[] = [];
    unlisted.forEach((_, id) => {
      if (customIds.has(id)) {
        duplicateIdsInUnlisted.push(id);
      }
    });

    if (hasCorruptedScheduled || duplicateIdsInUnlisted.length > 0) {
      if (customLists.has('scheduled')) {
        setCustomLists(prev => {
          const next = new Map(prev);
          next.delete('scheduled');
          return next;
        });
      }
      if (customTudus.has('scheduled')) {
        setCustomTudus(prev => {
          const next = new Map(prev);
          next.delete('scheduled');
          return next;
        });
      }
      if (duplicateIdsInUnlisted.length > 0) {
        setUnlisted(prev => {
          const next = new Map(prev);
          duplicateIdsInUnlisted.forEach(id => next.delete(id));
          return next;
        });
      }
    }
  }, [
    customLists,
    customTudus,
    unlisted,
    setCustomLists,
    setCustomTudus,
    setUnlisted,
  ]);

  return null;
};
