import React, {memo, useCallback} from 'react';
import {ListIcons} from '../../../list/constants';
import {SmartList} from '../../types';
import {StyledListCard} from './styles';
import {DefaultListsProps} from './types';

const DefaultLists: React.FC<DefaultListsProps> = memo(
  ({lists, onListPress}) => {
    const listPressHandlerGenerator = useCallback(
      (listData: SmartList) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    return (
      <>
        {lists.map(list => (
          <StyledListCard
            Icon={ListIcons[list.icon]}
            label={list.label}
            numberOfActiveItems={0}
            isHighlighted={list.isHighlighted}
            key={list.label}
            onPress={listPressHandlerGenerator(list)}
          />
        ))}
      </>
    );
  },
);

export {DefaultLists};
