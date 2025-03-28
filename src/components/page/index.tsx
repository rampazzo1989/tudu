import React, {memo, useEffect, useRef} from 'react';
import {PageProps} from './types';
import {StatusBar, StyledSafeAreaView} from './styles';
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
import changeNavigationBarColor from 'react-native-navigation-bar-color';

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

          // If the animation position is back to 0, re-shuffles the order list.
          if (animationPosition.current === 0) {
            shuffledOrder = generateShuffledArray(idlyAnimatedRefs.length);
          }

          idlyAnimatedRefs[position]?.animateFunction?.();
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

  setTimeout(() => changeNavigationBarColor('#25303D', true, false), 0);

  return (
    <StyledSafeAreaView>
      <StatusBar backgroundColor={theme.colors.primary} hidden={false} />
      {children}
    </StyledSafeAreaView>
  );
});

export {Page};
