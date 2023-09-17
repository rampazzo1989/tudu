import React, {memo, useCallback, useContext, useMemo} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListCard} from '../../../../components/list-card';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';
import {List} from '../../types';
import {EditableListCard} from '../../../../components/list-card/editable-list-card';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {generateListAndGroupArchiveTitle} from '../../../../utils/list-and-group-utils';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';

const CustomLists: React.FC<CustomListsProps> = memo(({data, onListPress}) => {
  const draggableContext = useContext(DraggableContext);

  const listPressHandlerGenerator = useCallback(
    (listData: List) => () => {
      onListPress(listData);
    },
    [onListPress],
  );

  const handleDeleteGenerator = useCallback(
    (draggableList: DraggableItem<List>) => () => {
      console.log('Delete', draggableList.data[0].label);
    },
    [],
  );

  const handleArchiveGenerator = useCallback(
    (draggableList: DraggableItem<List>) =>
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        return setTimeout(() => {
          draggableContext.showConfirmationModal(
            draggableList,
            generateListAndGroupArchiveTitle,
            'archive',
            () => swipeableRef.current?.closeOptions(),
          );
        }, 40);
      },
    [draggableContext],
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
