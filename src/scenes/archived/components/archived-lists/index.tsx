import React, {memo, useCallback, useMemo, useState} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {
  deleteList,
  generateListAndGroupDeleteTitle,
  unarchiveList,
} from '../../../../utils/list-and-group-utils';
import {ArchivedListsProps} from './types';
import {List} from '../../../home/types';
import {Container, StyledArchivedListCard} from './styles';
import {useSetRecoilState} from 'recoil';
import {archivedLists, myLists} from '../../../home/state';
import {PopupModal} from '../../../../components/popup-modal';
import {DeleteIcon} from '../../../../components/animated-icons/delete-icon';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';

const ArchivedLists: React.FC<ArchivedListsProps> = memo(
  ({data, onListPress}) => {
    const setArchivedLists = useSetRecoilState(archivedLists);
    const setCustomLists = useSetRecoilState(myLists);
    const [confirmationModalVisible, setConfirmationModalVisible] =
      useState(false);
    const [deletingList, setDeletingList] = useState<List>();
    const [deletingListRef, setDeletingListRef] =
      useState<React.RefObject<SwipeableCardRef>>();

    const listPressHandlerGenerator = useCallback(
      (listData: List) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleDeleteGenerator = useCallback(
      (list: List) => (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        setDeletingList(list);
        setConfirmationModalVisible(true);
        setDeletingListRef(swipeableRef);
      },
      [],
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

    const handleCleanDeletingList = useCallback(() => {
      setConfirmationModalVisible(false);
      setDeletingList(undefined);
      setDeletingListRef(undefined);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (!deletingList) {
        return;
      }
      deleteList(setArchivedLists, deletingList);
      handleCleanDeletingList();
    }, [deletingList, handleCleanDeletingList, setArchivedLists]);

    const handleCancelDelete = useCallback(() => {
      handleCleanDeletingList();
      deletingListRef?.current?.closeOptions();
    }, [deletingListRef, handleCleanDeletingList]);

    return (
      <Container>
        {memoizedItems}
        <PopupModal
          visible={confirmationModalVisible}
          onRequestClose={handleCleanDeletingList}
          title={generateListAndGroupDeleteTitle(deletingList)}
          buttons={[
            {label: 'Yes', onPress: handleConfirmDelete},
            {label: 'No', onPress: handleCancelDelete},
          ]}
          Icon={DeleteIcon}
          shakeOnShow
          haptics
        />
      </Container>
    );
  },
);

export {ArchivedLists};
