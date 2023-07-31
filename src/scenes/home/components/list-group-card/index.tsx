import React, {memo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {DraggableItem} from '../../../../modules/draggable/draggable-item';
import {ListGroupContainer, SubListCard, Title} from './styles';
import {ListGroupProps} from './types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({groupTitle, items}) => {
  return (
    <ListGroupContainer>
      <Title>{groupTitle}</Title>
      {items.map(list => {
        return (
          <DraggableItem
            key={generateRandomHash(`${list.label}${groupTitle}`)}
            payload={list}>
            <SubListCard
              Icon={ListDefaultIcon}
              label={list.label}
              numberOfActiveItems={list.numberOfActiveItems}
            />
          </DraggableItem>
        );
      })}
    </ListGroupContainer>
  );
});

export {ListGroupCard};
