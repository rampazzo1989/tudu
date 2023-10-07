import React, {memo, useCallback, useMemo, useRef} from 'react';
import {useTheme} from 'styled-components/native';
import {DeleteIcon} from '../../animated-icons/delete-icon';
import {RenameIcon} from '../../animated-icons/rename-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableCardRef, SwipeableOption} from '../../swipeable-card/types';
import {SwipeableListCardProps} from './types';
import {FolderAddIcon} from '../../animated-icons/folder-add-icon';

const SwipeableListCard: React.FC<SwipeableListCardProps> = memo(
  ({children, isHighlighted, onArchive, onDelete, onEdit, enabled = false}) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: RenameIcon,
          onPress: () => onEdit(swipeableRef),
        },
        {
          Icon: DeleteIcon,
          onPress: () => onDelete(swipeableRef),
        },
      ],
      [onDelete, onEdit],
    );

    const leftOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: FolderAddIcon,
          text: 'Archive',
        },
      ],
      [],
    );

    const handleSwipeRight = useCallback(() => {
      onArchive(swipeableRef);
    }, [onArchive]);

    const handleSwipeLeft = useCallback(() => {}, []);

    return (
      <SwipeableCard
        enabled={enabled}
        ref={swipeableRef}
        backgroundColor={
          isHighlighted
            ? theme.colors.listCardHighlighted
            : theme.colors.listCard
        }
        rightOptions={rightOptions}
        leftOptions={leftOptions}
        fullWidthOnLeftOptions
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        optionsBackgroundColor={theme.colors.primary}>
        {children}
      </SwipeableCard>
    );
  },
);

export {SwipeableListCard};
