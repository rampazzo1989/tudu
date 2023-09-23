import React, {memo, useCallback, useContext, useMemo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';
import {List} from '../../types';
import {EditableListCard} from '../../../../components/list-card/editable-list-card';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  archiveList,
  generateListAndGroupArchiveTitle,
  generateListAndGroupDeleteTitle,
} from '../../../../utils/list-and-group-utils';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {useSetRecoilState} from 'recoil';
import {archivedLists, myLists} from '../../state';

const CustomLists: React.FC<CustomListsProps> = memo(({data, onListPress}) => {
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
    (draggableList: DraggableItem<List>) => () => {
      draggableContext.showConfirmationModal(
        draggableList,
        generateListAndGroupDeleteTitle,
        'delete',
      );
    },
    [draggableContext],
  );

  const handleArchiveGenerator = useCallback(
    (draggableList: DraggableItem<List>) =>
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        return draggableContext.showConfirmationModal(
          draggableList,
          generateListAndGroupArchiveTitle,
          'archive',
          () => swipeableRef.current?.closeOptions(),
          () =>
            archiveList(
              setArchivedLists,
              setCustomLists,
              draggableList.data[0],
            ),
        );
      },
    [draggableContext, setArchivedLists, setCustomLists],
  );

  const memoizedItems = useMemo(() => {
    return (
      <>
        {data.map((item, index) => {
          if (item.groupId) {
            return (
              <DraggableView
                key={`${item.groupId}${index}${item.data.length}`}
                payload={item}
                isReceiver>
                <ListGroupCard groupData={item} onListPress={onListPress} />
              </DraggableView>
            );
          } else {
            const onlyItem = item.data[0];
            return (
              <DraggableView key={`${onlyItem.label}${index}`} payload={item}>
                <EditableListCard
                  Icon={ListDefaultIcon}
                  label={onlyItem.label}
                  numberOfActiveItems={onlyItem.numberOfActiveItems}
                  color={onlyItem.color}
                  onPress={listPressHandlerGenerator(onlyItem)}
                  onDelete={handleDeleteGenerator(item)}
                  onArchive={handleArchiveGenerator(item)}
                />
              </DraggableView>
            );
          }
        })}
      </>
    );
  }, [
    data,
    handleArchiveGenerator,
    handleDeleteGenerator,
    listPressHandlerGenerator,
    onListPress,
  ]);

  return <Container>{memoizedItems}</Container>;
});

export {CustomLists};
