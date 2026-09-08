import React, {useEffect, useCallback} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {currentlyOpenSwipeableRef} from '../state/atoms';
import {useRecoilState} from 'recoil';

type ClosableSwipeable = {close: () => void};

const useControlSwipeableState = (
  swipeableRef: React.RefObject<ClosableSwipeable | null>,
) => {
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useRecoilState(
    currentlyOpenSwipeableRef,
  );

  const setOpenSwipeable = useCallback(() => {
    setCurrentlyOpenSwipeable(swipeableRef as any);
  }, [setCurrentlyOpenSwipeable, swipeableRef]);

  useEffect(() => {
    if (currentlyOpenSwipeable?.current !== swipeableRef.current) {
      swipeableRef.current?.close();
    }
  }, [swipeableRef, currentlyOpenSwipeable]);

  return {setOpenSwipeable};
};

export {useControlSwipeableState};
