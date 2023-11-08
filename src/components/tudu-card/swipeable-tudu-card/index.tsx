import React, {memo, useCallback, useMemo, useRef} from 'react';
import {useTheme} from 'styled-components/native';
import {DeleteIcon} from '../../animated-icons/delete-icon';
import {RenameIcon} from '../../animated-icons/rename-icon';
import {SwipeableCard} from '../../swipeable-card';
import {SwipeableCardRef, SwipeableOption} from '../../swipeable-card/types';
import {SunIcon} from '../../animated-icons/sun-icon';
import {SwipeableTuduCardProps} from './types';
import {UndoSunIcon} from '../../animated-icons/undo-sun-icon';
import {useTranslation} from 'react-i18next';

const SwipeableTuduCard: React.FC<SwipeableTuduCardProps> = memo(
  ({
    children,
    onSendToOrRemoveFromToday: onSendOrRemoveFromToday,
    onDelete,
    onEdit,
    done,
    isOnToday = false,
  }) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);
    const {t} = useTranslation();

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
          Icon: isOnToday ? UndoSunIcon : SunIcon,
          text: isOnToday
            ? t('actions.removeFromToday')
            : t('actions.sendToToday'),
        },
      ],
      [isOnToday, t],
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
        optionsSize="large"
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
