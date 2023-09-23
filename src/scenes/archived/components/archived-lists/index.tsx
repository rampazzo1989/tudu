import React, {memo, useCallback, useContext, useMemo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  generateListAndGroupDeleteTitle,
  unarchiveList,
} from '../../../../utils/list-and-group-utils';
import {ArchivedListsProps} from './types';
import {List} from '../../../home/types';
import {Container, StyledArchivedListCard} from './styles';
import {useSetRecoilState} from 'recoil';
import {archivedLists, myLists} from '../../../home/state';

const ArchivedLists: React.FC<ArchivedListsProps> = memo(
  ({data, onListPress}) => {
    const draggableContext = useContext(DraggableContext);
    const setArchivedLists = useSetRecoilState(archivedLists);
    const setCustomLists = useSetRecoilState(myLists);

    const listPressHandlerGenerator = useCallback(
      (listData: List) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleDeleteGenerator = useCallback(
      (list: List) => () => {
        draggableContext.showConfirmationModal(
          list,
          generateListAndGroupDeleteTitle,
          'delete',
        );
      },
      [draggableContext],
    );

    const handleUnarchiveGenerator = useCallback(
      (list: List) => () => {
        unarchiveList(setArchivedLists, setCustomLists, list);
      },
      [setArchivedLists, setCustomLists],
    );

    const memoizedItems = useMemo(() => {
      return (
        <>
          {data.map((item, index) => {
            return (
              <StyledArchivedListCard
                Icon={ListDefaultIcon}
                label={item.label}
                numberOfActiveItems={item.numberOfActiveItems}
                color={item.color}
                onPress={listPressHandlerGenerator(item)}
                onDelete={handleDeleteGenerator(item)}
                onUnarchive={handleUnarchiveGenerator(item)}
                key={`${item.label}${index}`}
              />
            );
          })}
        </>
      );
    }, [
      data,
      handleDeleteGenerator,
      handleUnarchiveGenerator,
      listPressHandlerGenerator,
    ]);

    return <Container>{memoizedItems}</Container>;
  },
);

export {ArchivedLists};
