import React, {memo, useCallback} from 'react';
import {useRecoilValue} from 'recoil';
import {ListIcons} from '../../../list/constants';
import {smartListsTuduCount} from '../../state';
import {SmartList} from '../../types';
import {StyledListCard} from './styles';
import {DefaultListsProps} from './types';

const SmartLists: React.FC<DefaultListsProps> = memo(({lists, onListPress}) => {
  const smartListsUndoneCounter = useRecoilValue(smartListsTuduCount);

  const getNumberOfActiveTudus = useCallback(
    (list: SmartList) => {
      switch (list.id) {
        case 'all':
          return smartListsUndoneCounter.allTudus;
        case 'today':
          return smartListsUndoneCounter.todayCount;
        case 'starred':
          return smartListsUndoneCounter.starredCount;
        default:
          return 0;
      }
    },
    [
      smartListsUndoneCounter.allTudus,
      smartListsUndoneCounter.starredCount,
      smartListsUndoneCounter.todayCount,
    ],
  );

  const listPressHandlerGenerator = useCallback(
    (listData: SmartList) => () => {
      onListPress(listData, getNumberOfActiveTudus(listData));
    },
    [getNumberOfActiveTudus, onListPress],
  );

  return (
    <>
      {lists.map(list => (
        <StyledListCard
          Icon={ListIcons[list.icon]}
          label={list.label}
          showNumberOfActiveItems={list.id !== 'archived'}
          numberOfActiveItems={getNumberOfActiveTudus(list)}
          isHighlighted={list.isHighlighted}
          key={list.label}
          onPress={listPressHandlerGenerator(list)}
        />
      ))}
    </>
  );
});

export {SmartLists};
