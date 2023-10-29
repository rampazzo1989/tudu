import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {SlideInRight} from 'react-native-reanimated';
import {useCloseCurrentlyOpenSwipeable} from '../../../../hooks/useCloseAllSwipeables';
import Toast from 'react-native-toast-message';
import {refreshListState} from '../../../../modules/draggable/draggable-utils';
import {showItemDeletedToast} from '../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {ListViewModel} from '../../types';
import {useListService} from '../../../../service/list-service-hook/useListService';

const CustomLists: React.FC<CustomListsProps> = memo(
  ({onListPress, animateIcon}) => {
    const draggableContext =
      useContext<DraggableContextType<ListViewModel>>(DraggableContext);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingList, setEditingList] = useState<ListViewModel>();

    const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

    const {archiveList} = useListService();

    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof SlideInRight | undefined
    >(() => SlideInRight);

    const {t} = useTranslation();

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

    const listPressHandlerGenerator = useCallback(
      (listData: ListViewModel) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleUndoDeletePress = useCallback(() => {
      try {
        const parsedOldState: DraggableItem<ListViewModel>[] = JSON.parse(
          previousStateData.current,
        );

        refreshListState(parsedOldState, draggableContext.setData);
        Toast.hide();
      } catch {
        Toast.show({
          type: 'error',
          position: 'bottom',
          bottomOffset: 60,
          text1: 'Unexpected error on trying to undo',
        });
      }
    }, [draggableContext.setData]);

    const handleDeleteGenerator = useCallback(
      (listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          previousStateData.current = JSON.stringify(draggableContext.data);
          draggableContext.showConfirmationModal(
            listOrDraggableList,
            generateListAndGroupDeleteTitle,
            'delete',
            () => swipeableRef.current?.closeOptions(),
            () => {
              animateIcon?.(DeleteIconActionAnimation);
              showItemDeletedToast(
                t('toast.itemDeleted', {itemType: t('toast.itemType.list')}),
                handleUndoDeletePress,
              );
            },
          );
        },
      [animateIcon, draggableContext, handleUndoDeletePress, t],
    );

    const archive = useCallback(
      (list: ListViewModel) => {
        archiveList(list);
        animateIcon?.(FolderAddIconActionAnimation);
      },
      [animateIcon, archiveList],
    );

    const handleArchiveGenerator = useCallback(
      (listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const list =
            listOrDraggableList instanceof DraggableItem<ListViewModel>
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
      (listOrDraggableList: DraggableItem<ListViewModel> | ListViewModel) =>
        () => {
          const list =
            listOrDraggableList instanceof DraggableItem<ListViewModel>
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
                    onListPress={onListPress}
                    animateIcon={animateIcon}
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
      draggableContext.data,
      editModalVisible,
      editingList,
      enteringAnimation,
      handleArchiveGenerator,
      handleDeleteGenerator,
      handleEditListGenerator,
      listPressHandlerGenerator,
      onListPress,
    ]);

    return <Container>{memoizedItems}</Container>;
  },
);

export {CustomLists};
