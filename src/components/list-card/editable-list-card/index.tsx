import React, {memo} from 'react';
import {useTheme} from 'styled-components/native';
import {NumberOfActiveItems} from '..';
import {ControlComponentContainer, IconLabelContainer, Label} from '../styles';
import {SwipeableListCard} from '../swipeable-list-card';
import {EditableListCardProps} from '../types';
import {ListCardContainer} from './styles';

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
  }) => {
    const theme = useTheme();
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
          onDelete={onDelete}>
          <IconLabelContainer>
            {ControlComponent && (
              <ControlComponentContainer>
                {ControlComponent}
              </ControlComponentContainer>
            )}
            <Icon animateWhenIdle />
            <Label isHighlighted={isHighlighted} numberOfLines={1}>
              {label}
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
