import React, {memo} from 'react';
import {Pressable, TouchableNativeFeedback} from 'react-native';
import {
  Container,
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
  ({icon, label, numberOfActiveItems, style, isHighlighted = false}) => {
    return (
      <ListCardContainer
        isHighlighted={isHighlighted}
        style={style}
        onPress={() => console.log('LIST CARD TOUCH', {label})}>
        <IconLabelContainer>
          {/* ICON */}
          <Label isHighlighted={isHighlighted}>{label}</Label>
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
