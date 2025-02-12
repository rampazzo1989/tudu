import React, {memo} from 'react';
import {styles} from './styles';
import {SkeletonTuduListProps} from './types';
import Skeleton from '../skeleton';

const MAX_PLACEHOLDERS = 7;

const SkeletonTuduList = memo<SkeletonTuduListProps>(({numberOfItems}) => {
  return (
      <Skeleton
        count={
          numberOfItems !== undefined && numberOfItems < MAX_PLACEHOLDERS ? numberOfItems : MAX_PLACEHOLDERS
        }
        style={styles.skeleton}
      />
  );
});

export {SkeletonTuduList};
