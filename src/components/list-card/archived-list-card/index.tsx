import React, {memo, useMemo} from 'react';
import {NumberOfActiveItems} from '..';
import {
  ControlComponentContainer,
  Emoji,
  IconLabelContainer,
  Label,
} from '../styles';
import {ArchivedListCardProps} from '../types';
import {SwipeableListCardArchived} from '../swipeable-list-card-archived';
import {ListCardContainer} from './styles';
import {
  getEmojiFromBeginning,
  removeEmojiFromBeginning,
} from '../../../utils/emoji-utils';

const ArchivedListCard: React.FC<ArchivedListCardProps> = memo(
  ({
    Icon,
    label,
    numberOfActiveItems,
    style,
    onPress,
    ControlComponent,
    swipeEnabled = true,
    onUnarchive,
    onDelete,
  }) => {
    const labelEmoji = useMemo(() => getEmojiFromBeginning(label), [label]);

    const trimmedLabel = useMemo(
      () => removeEmojiFromBeginning(label),
      [label],
    );
    return (
      <ListCardContainer
        activeOpacity={1}
        delayPressEvent={150}
        disabled={!onPress}
        scaleFactor={0.02}
        style={style}
        onPress={onPress}>
        <SwipeableListCardArchived
          enabled={swipeEnabled}
          onUnarchive={onUnarchive}
          onDelete={onDelete}>
          <IconLabelContainer>
            {ControlComponent && (
              <ControlComponentContainer>
                {ControlComponent}
              </ControlComponentContainer>
            )}
            {labelEmoji ? (
              <Emoji adjustsFontSizeToFit>{labelEmoji}</Emoji>
            ) : (
              <Icon animateWhenIdle size={20} />
            )}
            <Label numberOfLines={1}>{trimmedLabel}</Label>
          </IconLabelContainer>
          <NumberOfActiveItems numberOfActiveItems={numberOfActiveItems} />
        </SwipeableListCardArchived>
      </ListCardContainer>
    );
  },
);

export {ArchivedListCard};
