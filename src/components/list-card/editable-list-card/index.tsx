import React, {memo, useMemo} from 'react';
import {NumberOfActiveItems} from '..';
import {trimEmoji} from '../../../utils/emoji-utils';
import {ControlComponentContainer, IconLabelContainer, Label} from '../styles';
import {SwipeableListCard} from '../swipeable-list-card';
import {EditableListCardProps} from '../types';
import {Emoji, ListCardContainer} from './styles';

const EditableListCard: React.FC<EditableListCardProps> = memo(
  ({
    Icon,
    label,
    numberOfActiveItems,
    style,
    onPress,
    ControlComponent,
    isHighlighted = false,
    swipeEnabled = true,
    onArchive,
    onDelete,
    onEdit,
  }) => {
    const emojiInfo = useMemo(() => trimEmoji(label.trim()), [label]);

    return (
      <ListCardContainer
        isHighlighted={isHighlighted}
        activeOpacity={1}
        delayPressEvent={150}
        disabled={!onPress}
        scaleFactor={0.02}
        style={style}
        onPress={onPress}>
        <SwipeableListCard
          enabled={swipeEnabled}
          isHighlighted={isHighlighted}
          onArchive={onArchive}
          onDelete={onDelete}
          onEdit={onEdit}>
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
            <Label isHighlighted={isHighlighted} numberOfLines={1}>
              {emojiInfo?.formattedText ?? label.trim()}
            </Label>
          </IconLabelContainer>
          <NumberOfActiveItems
            numberOfActiveItems={numberOfActiveItems}
            isHighlighted={isHighlighted}
          />
        </SwipeableListCard>
      </ListCardContainer>
    );
  },
);

export {EditableListCard};
