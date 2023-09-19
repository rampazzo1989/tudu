import React, {memo, useCallback, useMemo, useRef} from 'react';
import {useTheme} from 'styled-components/native';
import {DeleteIcon} from '../../animated-icons/delete-icon';
import {FolderIcon} from '../../animated-icons/folder-icon';
import {MenuToggleIcon} from '../../animated-icons/menu-toggle-icon';
import {RenameIcon} from '../../animated-icons/rename-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableCardRef, SwipeableOption} from '../../swipeable-card/types';
import {SwipeableListCardProps} from './types';

const SwipeableListCard: React.FC<SwipeableListCardProps> = memo(
  ({children, isHighlighted, onArchive, onDelete, enabled = false}) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: MenuToggleIcon,
          onPress: () => console.log('Options'),
          popoverMenuOptions: [
            {
              Icon: RenameIcon,
              label: 'Rename',
              onPress: () => console.log('Rename'),
            },
            {
              Icon: DeleteIcon,
              label: 'Delete Group',
              onPress: () => console.log('Delete'),
            },
          ],
        },
      ],
      [],
    );

    const leftOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: FolderIcon,
          text: 'Archive',
          onPress: () => console.log('Archive'),
        },
      ],
      [],
    );

    const handleSwipeRight = useCallback(() => {
      onArchive(swipeableRef);
    }, [onArchive]);

    const handleSwipeLeft = useCallback(() => {
      onDelete(swipeableRef);
    }, [onDelete]);

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
