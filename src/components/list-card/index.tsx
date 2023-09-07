import React, {memo} from 'react';
import {
  Container,
  ControlComponentContainer,
  IconLabelContainer,
  Label,
  ListCardContainer,
  Number,
} from './styles';
import {ListCardProps, NumberOfActiveItemsProps} from './types';

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

const ListCard: React.FC<ListCardProps> = memo(
  ({
    Icon,
    label,
    numberOfActiveItems,
    style,
    onPress,
    ControlComponent,
    isHighlighted = false,
  }) => {
    return (
      <ListCardContainer
        isHighlighted={isHighlighted}
        activeOpacity={0.8}
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
          <Icon />
          <Label isHighlighted={isHighlighted} numberOfLines={1}>
            {label}
          </Label>
        </IconLabelContainer>
        <NumberOfActiveItems
          numberOfActiveItems={numberOfActiveItems}
          isHighlighted={isHighlighted}
        />
      </ListCardContainer>
    );
  },
);

export {ListCard};
