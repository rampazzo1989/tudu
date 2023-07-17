import React, {memo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {ListGroupContainer, SubListCard, Title} from './styles';
import {ListGroupProps} from './types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({group}) => {
  return (
    <ListGroupContainer>
      <Title>{group.title}</Title>
      {group.lists.map(list => {
        return (
          <SubListCard
            Icon={ListDefaultIcon}
            label={list.label}
            numberOfActiveItems={list.numberOfActiveItems}
            key={list.label}
          />
        );
      })}
    </ListGroupContainer>
  );
});

export {ListGroupCard};
