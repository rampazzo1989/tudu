import React, {memo} from 'react';
import {Skeleton} from 'react-native-animated-skeleton';
import Animated, {SlideOutLeft} from 'react-native-reanimated';
import {styles} from './styles';
import {SkeletonTuduListProps} from './types';

const SkeletonTuduList = memo<SkeletonTuduListProps>(({numberOfItems}) => {
  return (
    <Animated.View exiting={SlideOutLeft.duration(75)}>
      <Skeleton
        numberOfItems={
          numberOfItems !== undefined && numberOfItems < 4 ? numberOfItems : 4
        }
        speed={500}
        direction="column"
        loaderStyle={styles.skeleton}
      />
    </Animated.View>
  );
});

export {SkeletonTuduList};
