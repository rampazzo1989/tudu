import React, {memo, useCallback, useMemo, useRef} from 'react';
import {useTheme} from 'styled-components/native';
import {DeleteIcon} from '../../animated-icons/delete-icon';
import {RenameIcon} from '../../animated-icons/rename-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableCardRef, SwipeableOption} from '../../swipeable-card/types';
import {SunIcon} from '../../animated-icons/sun-icon';
import {SwipeableTuduCardProps} from './types';

const SwipeableTuduCard: React.FC<SwipeableTuduCardProps> = memo(
  ({children, onSendOrRemoveFromToday, onDelete, onEdit, done}) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: RenameIcon,
          text: 'Edit',
          onPress: () => onEdit(swipeableRef),
        },
        {
          Icon: DeleteIcon,
          text: 'Delete',
          onPress: () => onDelete(swipeableRef),
        },
      ],
      [onDelete, onEdit],
    );

    const leftOptions = useMemo<SwipeableOption[]>(
      () => [
        {
          Icon: SunIcon,
          text: 'Send to Today',
        },
      ],
      [],
    );

    const handleSwipeRight = useCallback(() => {
      onSendOrRemoveFromToday(swipeableRef);
    }, [onSendOrRemoveFromToday]);

    const handleSwipeLeft = useCallback(() => {}, []);

    return (
      <SwipeableCard
        enabled={!done}
        ref={swipeableRef}
        backgroundColor={
          done ? theme.colors.tuduCardDone : theme.colors.tuduCard
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

export {SwipeableTuduCard};
