import React, {memo, useCallback, useMemo, useState} from 'react';
import {ListDefaultIcon} from '../../../../components/animated-icons/list-default-icon';
import {generateListAndGroupDeleteTitle} from '../../../../utils/list-and-group-utils';
import {ArchivedListsProps} from './types';
import {Container, StyledArchivedListCard} from './styles';
import {PopupModal} from '../../../../components/popup-modal';
import {DeleteIcon} from '../../../../components/animated-icons/delete-icon';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';
import {ListViewModel} from '../../../home/types';
import {useListService} from '../../../../service/list-service-hook/useListService';
import {useTranslation} from 'react-i18next';

const ArchivedLists: React.FC<ArchivedListsProps> = memo(
  ({data, onListPress}) => {
    const [confirmationModalVisible, setConfirmationModalVisible] =
      useState(false);
    const [deletingList, setDeletingList] = useState<ListViewModel>();
    const [deletingListRef, setDeletingListRef] =
      useState<React.RefObject<SwipeableCardRef>>();
    const {unarchiveList, deleteList} = useListService();
    const {t} = useTranslation();

    const listPressHandlerGenerator = useCallback(
      (listData: ListViewModel) => () => {
        onListPress(listData);
      },
      [onListPress],
    );

    const handleDeleteGenerator = useCallback(
      (list: ListViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          setDeletingList(list);
          setConfirmationModalVisible(true);
          setDeletingListRef(swipeableRef);
        },
      [],
    );

    const handleUnarchiveGenerator = useCallback(
      (list: ListViewModel) => () => {
        unarchiveList(list);
      },
      [unarchiveList],
    );

    const memoizedItems = useMemo(() => {
      return (
        <>
          {data.map((item, index) => {
            return (
              <StyledArchivedListCard
                Icon={ListDefaultIcon}
                label={item.label}
                numberOfActiveItems={item.getNumberOfActiveItems()}
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
      deleteList(deletingList);
      handleCleanDeletingList();
    }, [deletingList, deleteList, handleCleanDeletingList]);

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
            {label: t('buttons.yes'), onPress: handleConfirmDelete},
            {label: t('buttons.no'), onPress: handleCancelDelete},
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
