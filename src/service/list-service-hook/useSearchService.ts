import fuse from 'fuse.js';
import { useCallback, useRef } from 'react';
import { TuduViewModel } from '../../scenes/home/types';
import { useListService } from './useListService';

const useSearchService = () => {
  const { getAllTudus } = useListService();
  const fuseRef = useRef<{ list: TuduViewModel[]; instance: fuse<TuduViewModel> } | null>(null);

  const getFuseInstance = useCallback(() => {
    const allTudus = getAllTudus() ?? [];
    if (!fuseRef.current || fuseRef.current.list.length !== allTudus.length) {
      fuseRef.current = {
        list: allTudus,
        instance: new fuse(allTudus, {
          keys: ['label', 'listName'],
          threshold: 0.3,
          shouldSort: true,
        }),
      };
    }
    return fuseRef.current.instance;
  }, [getAllTudus]);

  const searchTudus = useCallback(
    (searchText: string) => {
      const trimmed = searchText.trim();
      if (!trimmed) {
        return (getAllTudus() ?? []).sort((a, b) => Number(a.done) - Number(b.done));
      }

      const fuseObject = getFuseInstance();
      const result = fuseObject.search(trimmed);

      return result
        .map(x => x.item)
        .sort((a, b) => Number(a.done) - Number(b.done));
    },
    [getAllTudus, getFuseInstance],
  );

  return { searchTudus };
};

export { useSearchService };
