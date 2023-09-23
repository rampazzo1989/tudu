import React, {memo} from 'react';
import {NumberOfActiveItems} from '..';
import {ControlComponentContainer, IconLabelContainer, Label} from '../styles';
import {ArchivedListCardProps} from '../types';
import {SwipeableListCardArchived} from '../swipeable-list-card-archived';
import {ListCardContainer} from './styles';

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
            <Icon animateWhenIdle />
            <Label numberOfLines={1}>{label}</Label>
          </IconLabelContainer>
          <NumberOfActiveItems numberOfActiveItems={numberOfActiveItems} />
        </SwipeableListCardArchived>
      </ListCardContainer>
    );
  },
);

export {ArchivedListCard};
