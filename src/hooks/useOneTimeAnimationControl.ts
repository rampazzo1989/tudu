import { useState, useEffect, useCallback } from 'react';
import { IEntryExitAnimationBuilder } from 'react-native-reanimated';

const useOneTimeAnimationControl = () => {
  const [isFistTimeRendered, setFirstTimeRendered] = useState(true);

  useEffect(() => {
    setFirstTimeRendered(false);
  }, []);

  const animateOnceOnly = useCallback(
    (animation: IEntryExitAnimationBuilder) => isFistTimeRendered ? animation : undefined, 
    [isFistTimeRendered]);

  return {animateOnceOnly};
};

export {useOneTimeAnimationControl};