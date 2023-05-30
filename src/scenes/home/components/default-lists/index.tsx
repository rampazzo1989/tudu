import React, {memo} from 'react';
import {StyledListCard} from './styles';
import {DefaultListsProps} from './types';

const DefaultLists: React.FC<DefaultListsProps> = memo(({lists}) => {
  return (
    <>
      {lists.map(list => (
        <StyledListCard
          icon={list.icon}
          label={list.label}
          numberOfActiveItems={list.numberOfActiveItems}
          isHighlighted={list.isHighlighted}
        />
      ))}
    </>
  );
});

export {DefaultLists};
