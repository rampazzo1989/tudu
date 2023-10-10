import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {ListGroupCard} from '../list-group-card';
import {CustomListsProps} from './types';
import {Container} from './styles';
import {List} from '../../types';
import {EditableListCard} from '../../../../components/list-card/editable-list-card';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  archiveList,
  generateListAndGroupArchiveTitle,
  generateListAndGroupDeleteTitle,
} from '../../../../utils/list-and-group-utils';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {useSetRecoilState} from 'recoil';
import {archivedLists, myLists} from '../../state';
import {NewListModal} from '../../../group/components/new-list-modal';
import {FolderAddIconActionAnimation} from '../../../../components/animated-icons/folder-add-icon';
import {DeleteIconActionAnimation} from '../../../../components/animated-icons/delete-icon';
import {SlideInRight} from 'react-native-reanimated';

const CustomLists: React.FC<CustomListsProps> = memo(
  ({onListPress, animateIcon}) => {
    const draggableContext =
      useContext<DraggableContextType<List>>(DraggableContext);
    const setArchivedLists = useSetRecoilState(archivedLists);
    const setCustomLists = useSetRecoilState(myLists);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingList, setEditingList] = useState<List>();

    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof SlideInRight | undefined
    >(() => SlideInRight);

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

    const listPressHandlerGenerator = useCallback(
      (listData: List) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleDeleteGenerator = useCallback(
      (listOrDraggableList: DraggableItem<List> | List) => () => {
        draggableContext.showConfirmationModal(
          listOrDraggableList,
          generateListAndGroupDeleteTitle,
          'delete',
          undefined,
          () => animateIcon?.(DeleteIconActionAnimation),
        );
      },
      [animateIcon, draggableContext],
    );

    const archive = useCallback(
      (list: List) => {
        archiveList(setArchivedLists, setCustomLists, list);
        animateIcon?.(FolderAddIconActionAnimation);
      },
      [animateIcon, setArchivedLists, setCustomLists],
    );

    const handleArchiveGenerator = useCallback(
      (listOrDraggableList: DraggableItem<List> | List) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const list =
            listOrDraggableList instanceof DraggableItem<List>
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
      (listOrDraggableList: DraggableItem<List> | List) => () => {
        const list =
          listOrDraggableList instanceof DraggableItem<List>
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
                  enteringAnimation={enteringAnimation
                    ?.duration(200)
                    .delay(index * 50)}
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
                <DraggableView
                  key={`${onlyItem.label}${index}`}
                  payload={item}
                  enteringAnimation={enteringAnimation
                    ?.duration(200)
                    .delay(index * 50)}>
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
            }}
          />
        </>
      );
    }, [
      animateIcon,
      draggableContext.data,
      editModalVisible,
      editingList,
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
