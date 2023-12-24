import React, {memo, useCallback, useContext, useMemo, useState} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';
import {EditableListCard} from '../../../../components/list-card/editable-list-card';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  generateListAndGroupArchiveTitle,
  generateListAndGroupDeleteTitle,
} from '../../../../utils/list-and-group-utils';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {NewListModal} from '../../../group/components/new-list-modal';
import {FolderAddIconActionAnimation} from '../../../../components/animated-icons/folder-add-icon';
import {DeleteIconActionAnimation} from '../../../../components/animated-icons/delete-icon';
import {useCloseCurrentlyOpenSwipeable} from '../../../../hooks/useCloseAllSwipeables';
import {showItemDeletedToast} from '../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {ListDataViewModel} from '../../types';
import {useListService} from '../../../../service/list-service-hook/useListService';
import {isNestedItem} from '../../../../modules/draggable/draggable-utils';

const CustomLists: React.FC<CustomListsProps> = memo(
  ({onListPress, animateIcon}) => {
    const draggableContext =
      useContext<DraggableContextType<ListDataViewModel>>(DraggableContext);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingList, setEditingList] = useState<ListDataViewModel>();

    const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

    const {archiveList, deleteList, deleteGroup, restoreBackup} =
      useListService();

    const {t} = useTranslation();

    const listPressHandlerGenerator = useCallback(
      (listData: ListDataViewModel) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleDeleteGenerator = useCallback(
      (
          listOrDraggableList:
            | DraggableItem<ListDataViewModel>
            | ListDataViewModel,
        ) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const listDataViewModel = isNestedItem(listOrDraggableList)
            ? listOrDraggableList
            : listOrDraggableList.data[0];
          draggableContext.showConfirmationModal(
            listDataViewModel,
            generateListAndGroupDeleteTitle,
            'delete',
            () => swipeableRef.current?.closeOptions(),
            () => {
              deleteList(listDataViewModel);
              animateIcon?.(DeleteIconActionAnimation);
              showItemDeletedToast(
                t('toast.itemDeleted', {itemType: t('toast.itemType.list')}),
                restoreBackup,
              );
            },
          );
        },
      [animateIcon, deleteList, draggableContext, restoreBackup, t],
    );

    const archive = useCallback(
      (list: ListDataViewModel) => {
        archiveList(list);
        animateIcon?.(FolderAddIconActionAnimation);
      },
      [animateIcon, archiveList],
    );

    const handleArchiveGenerator = useCallback(
      (
          listOrDraggableList:
            | DraggableItem<ListDataViewModel>
            | ListDataViewModel,
        ) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const list =
            listOrDraggableList instanceof DraggableItem<ListDataViewModel>
              ? listOrDraggableList.data[0]
              : listOrDraggableList;
          return draggableContext.showConfirmationModal(
            listOrDraggableList,
            generateListAndGroupArchiveTitle,
            'archive',
            () => swipeableRef.current?.closeOptions(),
            () => archive(list),
          );
        },
      [archive, draggableContext],
    );

    const handleEditListGenerator = useCallback(
      (
          listOrDraggableList:
            | DraggableItem<ListDataViewModel>
            | ListDataViewModel,
        ) =>
        () => {
          const list =
            listOrDraggableList instanceof DraggableItem<ListDataViewModel>
              ? listOrDraggableList.data[0]
              : listOrDraggableList;
          setEditingList(list);
          setEditModalVisible(true);
        },
      [],
    );

    const memoizedItems = useMemo(() => {
      return (
        <>
          {draggableContext.data.map((item, index) => {
            if (item.groupId) {
              return (
                <DraggableView
                  key={`${item.groupId}${index}${item.data.length}`}
                  payload={item}
                  isReceiver>
                  <ListGroupCard
                    handleArchiveGenerator={handleArchiveGenerator}
                    handleDeleteGenerator={handleDeleteGenerator}
                    handleEditListGenerator={handleEditListGenerator}
                    groupData={item}
                    deleteGroupFn={deleteGroup}
                    onListPress={onListPress}
                    animateIcon={animateIcon}
                    undoDeletionFn={restoreBackup}
                  />
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
                    onEdit={handleEditListGenerator(item)}
                  />
                </DraggableView>
              );
            }
          })}
          <NewListModal
            visible={editModalVisible}
            editingList={editingList}
            onRequestClose={() => {
              setEditModalVisible(false);
              setEditingList(undefined);
              closeCurrentlyOpenSwipeable();
            }}
          />
        </>
      );
    }, [
      animateIcon,
      closeCurrentlyOpenSwipeable,
      deleteGroup,
      draggableContext.data,
      editModalVisible,
      editingList,
      handleArchiveGenerator,
      handleDeleteGenerator,
      handleEditListGenerator,
      listPressHandlerGenerator,
      onListPress,
      restoreBackup,
    ]);

    return <Container>{memoizedItems}</Container>;
  },
);

export {CustomLists};
