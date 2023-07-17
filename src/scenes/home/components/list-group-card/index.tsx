import React, {memo} from 'react';
import {DraxView} from 'react-native-drax';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {ListGroupContainer, SubListCard, Title} from './styles';
import {ListGroupProps} from './types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({group}) => {
  return (
    <ListGroupContainer>
      <Title>{group.title}</Title>
      {group.lists.map((list, index) => {
        return (
          <DraxView
            draggable
            key={`${list.label}${index}`}
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
