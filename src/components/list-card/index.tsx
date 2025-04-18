import React, {memo, useMemo} from 'react';
import {trimEmoji} from '../../utils/emoji-utils';
import {
  Container,
  ControlComponentContainer,
  Emoji,
  IconLabelContainer,
  Label,
  ListCardContainer,
  Number,
} from './styles';
import {ListCardProps, NumberOfActiveItemsProps} from './types';
import i18next from 'i18next';

const NumberOfActiveItems: React.FC<NumberOfActiveItemsProps> = memo(
  ({numberOfActiveItems, isHighlighted}) => {
    return (
      <Container
        numberOfActiveItems={numberOfActiveItems}
        isHighlighted={isHighlighted}>
        <Number>{numberOfActiveItems}</Number>
      </Container>
    );
  },
);

const autoAnimateIcons = [i18next.t('labels.today')];

const checkIfAutoAnimateIcon = (label: string) => {
  return autoAnimateIcons.includes(label);
};

const ListCard: React.FC<ListCardProps> = memo(
  ({
    Icon,
    label,
    numberOfActiveItems,
    style,
    onPress,
    ControlComponent,
    isHighlighted = false,
    showNumberOfActiveItems = true,
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
        <IconLabelContainer>
          {ControlComponent && (
            <ControlComponentContainer>
              {ControlComponent}
            </ControlComponentContainer>
          )}
          {emojiInfo?.emoji ? (
            <Emoji adjustsFontSizeToFit>{emojiInfo.emoji}</Emoji>
          ) : (
            <Icon
              animateWhenIdle
              autoPlay={checkIfAutoAnimateIcon(label)}
              size={24}
            />
          )}
          <Label isHighlighted={isHighlighted} numberOfLines={1}>
            {emojiInfo?.formattedText ?? label}
          </Label>
        </IconLabelContainer>
        {showNumberOfActiveItems && (
          <NumberOfActiveItems
            numberOfActiveItems={numberOfActiveItems}
            isHighlighted={isHighlighted}
          />
        )}
      </ListCardContainer>
    );
  },
);

export {ListCard, NumberOfActiveItems};
