import React, {memo, useCallback, useMemo, useState} from 'react';
import {GroupPageProps} from './types';
import {DefaultHeader} from '../../components/default-header';
import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {
  Container,
  EmptyStateContainer,
  EmptyStateSubtitle,
  EmptyStateTitle,
  StyledListCard,
  styles,
} from './styles';
import {useListService} from '../../service/list-service-hook/useListService';
import {useTranslation} from 'react-i18next';
import {ListDataViewModel} from '../home/types';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {SwipeableCardRef} from '../../components/swipeable-card/types';
import {PopupModal} from '../../components/popup-modal';
import {DeleteIcon} from '../../components/animated-icons/delete-icon';
import {
  generateListAndGroupArchiveTitle,
  generateListAndGroupDeleteTitle,
} from '../../utils/list-and-group-utils';
import {NewListModal} from './components/new-list-modal';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {showItemDeletedToast} from '../../utils/toast-utils';

const GroupPage: React.FC<GroupPageProps> = memo(({navigation, route}) => {
  const {groupName} = route.params;
  const {getAllLists, deleteList, archiveList, restoreBackup} =
    useListService();
  const {t} = useTranslation();
  const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [deletingList, setDeletingList] = useState<ListDataViewModel>();
  const [deletingListRef, setDeletingListRef] =
    useState<React.RefObject<SwipeableCardRef>>();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<ListDataViewModel>();

  const groupLists = useMemo(() => {
    const all = getAllLists('default') ?? [];
    return all.filter(item => item.groupName === groupName);
  }, [getAllLists, groupName]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleListPress = useCallback(
    (listData: ListDataViewModel) => {
      navigation.navigate('List', {
        listId: listData.id,
        title: listData.label,
        listOrigin: listData.origin,
        numberOfUndoneTudus: listData.numberOfActiveItems,
      });
    },
    [navigation],
  );

  const listPressHandlerGenerator = useCallback(
    (listData: ListDataViewModel) => () => {
      handleListPress(listData);
    },
    [handleListPress],
  );

  const handleCleanDeletingList = useCallback(() => {
    setConfirmationModalVisible(false);
    setDeletingList(undefined);
    setDeletingListRef(undefined);
  }, []);

  const handleDeleteGenerator = useCallback(
    (list: ListDataViewModel) =>
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        setDeletingList(list);
        setConfirmationModalVisible(true);
        setDeletingListRef(swipeableRef);
      },
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!deletingList) {
      return;
    }
    deleteList(deletingList);
    showItemDeletedToast(
      t('toast.itemDeleted', {itemType: t('toast.itemType.list')}),
      restoreBackup,
    );
    handleCleanDeletingList();
  }, [deletingList, deleteList, handleCleanDeletingList, restoreBackup, t]);

  const handleCancelDelete = useCallback(() => {
    handleCleanDeletingList();
    deletingListRef?.current?.closeOptions();
  }, [deletingListRef, handleCleanDeletingList]);

  const handleArchiveGenerator = useCallback(
    (list: ListDataViewModel) =>
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        archiveList(list);
        swipeableRef.current?.closeOptions();
      },
    [archiveList],
  );

  const handleEditListGenerator = useCallback(
    (list: ListDataViewModel) => () => {
      setEditingList(list);
      setEditModalVisible(true);
    },
    [],
  );

  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setEditingList(undefined);
    closeCurrentlyOpenSwipeable();
  }, [closeCurrentlyOpenSwipeable]);

  return (
    <Page>
      <DefaultHeader
        Icon={FolderIcon}
        title={groupName}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        {groupLists.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateTitle>
              {t('emptyStates.group.title', {
                defaultValue: 'Nenhuma lista neste grupo',
              })}
            </EmptyStateTitle>
            <EmptyStateSubtitle>
              {t('emptyStates.group.subtitle', {
                defaultValue: 'Edite este grupo para adicionar listas a ele.',
              })}
            </EmptyStateSubtitle>
          </EmptyStateContainer>
        ) : (
          <Container>
            {groupLists.map(item => (
              <StyledListCard
                Icon={ListDefaultIcon}
                label={item.label}
                numberOfActiveItems={item.numberOfActiveItems}
                color={item.color}
                onPress={listPressHandlerGenerator(item)}
                onDelete={handleDeleteGenerator(item)}
                onArchive={handleArchiveGenerator(item)}
                onEdit={handleEditListGenerator(item)}
                key={item.id}
              />
            ))}
          </Container>
        )}
      </PageContent>

      <NewListModal
        visible={editModalVisible}
        editingList={editingList}
        onRequestClose={handleCloseEditModal}
      />

      <PopupModal
        visible={confirmationModalVisible}
        onTouchBackground={handleCleanDeletingList}
        title={generateListAndGroupDeleteTitle(deletingList)}
        buttons={[
          {label: t('buttons.yes'), onPress: handleConfirmDelete},
          {label: t('buttons.no'), onPress: handleCancelDelete},
        ]}
        Icon={DeleteIcon}
        shakeOnShow
        haptics
      />
    </Page>
  );
});

export {GroupPage};
