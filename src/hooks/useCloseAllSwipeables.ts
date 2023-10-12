import {useCallback} from 'react';
import {useRecoilValue} from 'recoil';
import {currentlyOpenSwipeableRef} from '../state/atoms';

const useCloseCurrentlyOpenSwipeable = () => {
  const currentlyOpenSwipeable = useRecoilValue(currentlyOpenSwipeableRef);

  const closeCurrentlyOpenSwipeable = useCallback(() => {
    currentlyOpenSwipeable?.current?.close();
  }, [currentlyOpenSwipeable]);

  return {closeCurrentlyOpenSwipeable};
};

export {useCloseCurrentlyOpenSwipeable};
