import React, {memo, useEffect, useRef} from 'react';
import {PageProps} from './types';
import {
  StatusBar,
  StyledKeyboardAvoidingView,
  StyledSafeAreaView,
} from './styles';
import {useTheme} from 'styled-components/native';
import {useIdle} from '../../contexts/idle-context';
import {useRecoilValue} from 'recoil';
import {idlyAnimatedComponents} from '../../state/atoms';
import {
  TIME_BETWEEN_IDLE_ANIMATIONS_HIGH_DENSITY,
  TIME_BETWEEN_IDLE_ANIMATIONS_LOW_DENSITY,
  TIME_BETWEEN_IDLE_ANIMATIONS_MEDIUM_DENSITY,
} from '../../constants';
import {generateShuffledArray} from '../../utils/array-utils';
import {Platform} from 'react-native';

const Page: React.FC<PageProps> = memo(({children}) => {
  const theme = useTheme();
  const idlyAnimatedRefs = useRecoilValue(idlyAnimatedComponents);
  const isIdle = useIdle();
  const idleTimerId = useRef<NodeJS.Timer>();
  const animationPosition = useRef<number>(0);

  useEffect(() => {
    if (idlyAnimatedRefs.length) {
      var shuffledOrder = generateShuffledArray(idlyAnimatedRefs.length);
      if (isIdle) {
        let timeBetweenAnimations = TIME_BETWEEN_IDLE_ANIMATIONS_LOW_DENSITY;

        console.log({idlyAnimatedRefsLength: idlyAnimatedRefs.length});

        if (idlyAnimatedRefs.length >= 20) {
          timeBetweenAnimations = TIME_BETWEEN_IDLE_ANIMATIONS_HIGH_DENSITY;
        } else if (idlyAnimatedRefs.length >= 10) {
          timeBetweenAnimations = TIME_BETWEEN_IDLE_ANIMATIONS_MEDIUM_DENSITY;
        }

        idleTimerId.current = setInterval(() => {
          const position = shuffledOrder[animationPosition.current];

          // Increments the position but resets it to zero when reaching the end.
          animationPosition.current =
            (animationPosition.current + 1) % idlyAnimatedRefs.length;

          // If the position is back to 0, re-shuffles the order list.
          if (position === 0) {
            shuffledOrder = generateShuffledArray(idlyAnimatedRefs.length);
          }

          idlyAnimatedRefs[position].animateFunction?.();
        }, timeBetweenAnimations);
      } else if (idleTimerId.current) {
        clearInterval(idleTimerId.current);
      }
    }

    return () => {
      if (idleTimerId.current) {
        clearInterval(idleTimerId.current);
      }
    };
  }, [idlyAnimatedRefs, isIdle]);

  return (
    <StyledSafeAreaView>
      <StatusBar backgroundColor={theme.colors.primary} />
      {children}
    </StyledSafeAreaView>
  );
});

export {Page};
