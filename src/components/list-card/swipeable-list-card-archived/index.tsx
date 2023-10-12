import React, {memo, useCallback, useMemo, useRef} from 'react';
import {useTheme} from 'styled-components/native';
import {DeleteIcon} from '../../animated-icons/delete-icon';
import {FolderIcon} from '../../animated-icons/folder-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableCardRef, SwipeableOption} from '../../swipeable-card/types';
import {SwipeableListCardArchivedProps} from './types';

const SwipeableListCardArchived: React.FC<SwipeableListCardArchivedProps> =
  memo(({children, onUnarchive, onDelete, enabled = false}) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: DeleteIcon,
          text: 'Delete',
        },
      ],
      [],
    );

    const leftOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: FolderIcon,
          text: 'Unarchive',
        },
      ],
      [],
    );

    const handleSwipeRight = useCallback(() => {
      setTimeout(() => onUnarchive(swipeableRef), 500);
    }, [onUnarchive]);

    const handleSwipeLeft = useCallback(() => {
      onDelete(swipeableRef);
    }, [onDelete]);

    return (
      <SwipeableCard
        enabled={enabled}
        ref={swipeableRef}
        backgroundColor={theme.colors.listCard}
        rightOptions={rightOptions}
        leftOptions={leftOptions}
        fullWidthOnLeftOptions
        fullWidthOnRightOptions
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        optionsBackgroundColor={theme.colors.primary}>
        {children}
      </SwipeableCard>
    );
  });

export {SwipeableListCardArchived};
