import fuse from 'fuse.js';
import {useCallback} from 'react';

import {useListService} from './useListService';

const useSearchService = () => {
  const {getAllTudus} = useListService();

  const searchTudus = useCallback(
    (searchText: string) => {
      const allTudus = getAllTudus();

      const fuseObject = new fuse(allTudus, {keys: ['label', 'listName']});

      const result = fuseObject.search(searchText);

      return result
        .map(x => x.item)
        .sort((a, b) => Number(a.done) - Number(b.done));
    },
    [getAllTudus],
  );

  return {searchTudus};
};

export {useSearchService};
