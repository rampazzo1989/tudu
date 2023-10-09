import React, {useEffect, useCallback} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {currentlyOpenSwipeableRef} from '../state/atoms';
import {useRecoilState} from 'recoil';

const useControlSwipeableState = (swipeableRef: React.RefObject<Swipeable>) => {
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useRecoilState(
    currentlyOpenSwipeableRef,
  );

  const setOpenSwipeable = useCallback(() => {
    console.log('Swipeable ref');
    setCurrentlyOpenSwipeable(swipeableRef);
  }, [setCurrentlyOpenSwipeable, swipeableRef]);

  useEffect(() => {
    if (currentlyOpenSwipeable?.current !== swipeableRef.current) {
      if (swipeableRef.current?.state.rowState !== 0) {
        swipeableRef.current?.close();
      }
    }
  }, [swipeableRef, currentlyOpenSwipeable]);

  return {setOpenSwipeable};
};

export {useControlSwipeableState};
