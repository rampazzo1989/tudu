import React, {memo} from 'react';
import {DraxView} from 'react-native-drax';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {ListGroupContainer, SubListCard, Title} from './styles';
import {ListGroupProps} from './types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({groupTitle, items}) => {
  return (
    <ListGroupContainer>
      <Title>{groupTitle}</Title>
      {items.map((list, index) => {
        return (
          <DraxView
            draggable
            key={generateRandomHash(`${list.label}${groupTitle}`)}
            payload={list}
            longPressDelay={300}>
            <SubListCard
              Icon={ListDefaultIcon}
              label={list.label}
              numberOfActiveItems={list.numberOfActiveItems}
            />
          </DraxView>
        );
      })}
    </ListGroupContainer>
  );
});

export {ListGroupCard};
