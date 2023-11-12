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
import {trimEmoji} from '../../../utils/emoji-utils';

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
    const emojiInfo = useMemo(() => trimEmoji(label), [label]);

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
            {emojiInfo?.emoji ? (
              <Emoji adjustsFontSizeToFit>{emojiInfo.emoji}</Emoji>
            ) : (
              <Icon animateWhenIdle size={20} />
            )}
            <Label numberOfLines={1}>{emojiInfo?.formattedText ?? label}</Label>
          </IconLabelContainer>
          <NumberOfActiveItems numberOfActiveItems={numberOfActiveItems} />
        </SwipeableListCardArchived>
      </ListCardContainer>
    );
  },
);

export {ArchivedListCard};
