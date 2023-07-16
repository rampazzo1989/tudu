import React, {memo} from 'react';
import {ListGroupContainer, Title} from './styles';
import {ListGroupProps} from './types';

const ListGroupCard: React.FC<ListGroupProps> = memo(({group}) => {
  return (
    <ListGroupContainer>
      <Title>{group.title}</Title>
      {/* ITEM LIST */}
    </ListGroupContainer>
  );
});

export {ListGroupCard};
