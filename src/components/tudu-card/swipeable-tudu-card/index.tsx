import React, { memo, useCallback, useMemo, useRef } from 'react';
import { useTheme } from 'styled-components/native';
import { DeleteIcon } from '../../animated-icons/delete-icon';
import { RenameIcon } from '../../animated-icons/rename-icon';
import { SwipeableCard } from '../../swipeable-card';
import { SwipeableCardRef, SwipeableOption } from '../../swipeable-card/types';
import { SunIcon } from '../../animated-icons/sun-icon';
import { SwipeableTuduCardProps } from './types';
import { UndoSunIcon } from '../../animated-icons/undo-sun-icon';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '../../animated-icons/calendar';

const SwipeableTuduCard: React.FC<SwipeableTuduCardProps> = memo(
  ({
    children,
    onSendToOrRemoveFromToday,
    onDelete,
    onEdit,
    onSchedule,
    done,
    isOnToday = false,
    enabled = true
  }) => {
    const theme = useTheme();
    const swipeableRef = useRef<SwipeableCardRef>(null);
    const { t } = useTranslation();

    const deleteOption = useMemo<SwipeableOption>(
      () => ({
        Icon: DeleteIcon,
        onPress: () => onDelete(swipeableRef),
      }),
      [onDelete],
    );

    const editOption = useMemo<SwipeableOption>(
      () => ({
        Icon: RenameIcon,
        onPress: () => onEdit(swipeableRef),
      }),
      [onEdit],
    );

    const scheduleOption = useMemo<SwipeableOption>(
      () => ({
        Icon: CalendarIcon,
        onPress: () => onSchedule(swipeableRef),
      }),
      [onSchedule],
    );

    const rightOptions = useMemo<SwipeableOption[]>(
      () => [scheduleOption, editOption, deleteOption],
      [scheduleOption, editOption, deleteOption],
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
      onSendToOrRemoveFromToday(swipeableRef);
    }, [onSendToOrRemoveFromToday]);

    const handleSwipeLeft = useCallback(() => { }, []);

    return (
      <SwipeableCard
        ref={swipeableRef}
        backgroundColor={
          done ? theme.colors.tuduCardDone : theme.colors.tuduCard
        }
        rightOptions={!done ? rightOptions : [deleteOption]}
        leftOptions={!done ? leftOptions : undefined}
        optionsSize="large"
        fullWidthOnLeftOptions
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        enabled={enabled}
        optionsBackgroundColor={theme.colors.primary}>
        {children}
      </SwipeableCard>
    );
  },
);

export { SwipeableTuduCard };
