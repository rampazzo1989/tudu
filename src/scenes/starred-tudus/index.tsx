import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {StarIcon} from '../../components/animated-icons/star-icon';
import {ListHeader} from '../../components/list-header';
import {NewTuduModal} from '../../components/new-tudu-modal';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {SimpleTuduList} from '../../components/simple-tudu-list';
import {SkeletonTuduList} from '../../components/skeleton-tudu-list';
import {TuduAdditionalInformation} from '../../components/tudu-card/types';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {useListService} from '../../service/list-service-hook/useListService';
import {formatToLocaleDate, isToday} from '../../utils/date-utils';
import {UNLISTED} from '../home/state';
import {ListViewModel, TuduViewModel} from '../home/types';
import {styles} from './styles';
import {StarredTudusPageProps} from './types';

const StarredTudusPage: React.FC<StarredTudusPageProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>();

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();

  const {getAllStarredTudus, saveTudu, deleteTudu, restoreBackup} =
    useListService();

  const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      const starredTudus = getAllStarredTudus();
      setTudus(starredTudus ?? []);
    }, 100);
  }, [getAllStarredTudus, setTudus]);

  const getAdditionalInformation = useCallback(
    (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
      if (tudu.listName && tudu.listId !== UNLISTED) {
        return {
          label: tudu.listName,
          originType: 'list',
        };
      }
      if (tudu.dueDate) {
        const isScheduledForToday = isToday(tudu.dueDate);
        return {
          label: isScheduledForToday
            ? 'Today'
            : formatToLocaleDate(tudu.dueDate),
          originType: isScheduledForToday ? 'today' : 'scheduled',
        };
      }
    },
    [],
  );

  const handleEditPress = useCallback((tudu: TuduViewModel) => {
    setEditingTudu(tudu);
    setNewTuduPopupVisible(true);
  }, []);

  const virtualList: ListViewModel = useMemo(() => {
    const list = new ListViewModel({
      id: 'starred-tudus',
      label: 'Starred tudús',
    });
    return list;
  }, []);

  return (
    <Page>
      <ListHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        Icon={StarIcon}
      />
      <PageContent contentContainerStyle={styles.pageContent}>
        {!tudus ? (
          <SkeletonTuduList numberOfItems={route.params?.numberOfUndoneTudus} />
        ) : (
          <SimpleTuduList
            getAdditionalInformation={getAdditionalInformation}
            tudus={tudus}
            updateTuduFn={saveTudu}
            deleteTuduFn={deleteTudu}
            undoDeletionFn={restoreBackup}
            onEditPress={handleEditPress}
          />
        )}
      </PageContent>

      <NewTuduModal
        visible={newTuduPopupVisible}
        onRequestClose={() => {
          setNewTuduPopupVisible(false);
          setEditingTudu(undefined);
          closeCurrentlyOpenSwipeable();
        }}
        editingTudu={editingTudu}
        onInsertOrUpdate={saveTudu}
      />
    </Page>
  );
};

export {StarredTudusPage};