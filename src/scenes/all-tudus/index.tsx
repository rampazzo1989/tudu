import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {ListHeader} from '../../components/list-header';
import {ListPageCore} from '../../components/list-page-core';
import {NewTuduModal} from '../../components/new-tudu-modal';
import {Page} from '../../components/page';
import {SimpleTuduList} from '../../components/simple-tudu-list';
import {TuduAdditionalInformation} from '../../components/tudu-card/types';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {formatToLocaleDate, isToday} from '../../utils/date-utils';
import {UNLISTED} from '../home/state';
import {ListViewModel, TuduViewModel} from '../home/types';
import {AllTudusPageProps} from './types';

const UNLOADED_ID = 'unloaded';

const AllTudusPage: React.FC<AllTudusPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>([]);

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();

  const {getAllUndoneTudus, saveTudu, deleteTudu, restoreBackup} =
    useListService();

  const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      const allTudus = getAllUndoneTudus();
      setTudus(allTudus ?? []);
    }, 100);
  }, [getAllUndoneTudus, setTudus]);

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
      id: 'all-tudus',
      label: 'All Undone Tudús',
    });
    list.tudus = tudus;

    return list;
  }, [tudus]);

  return (
    <Page>
      <ListHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        Icon={ListDefaultIcon}
      />
      <SimpleTuduList
        getAdditionalInformation={getAdditionalInformation}
        tudus={tudus}
        updateTuduFn={saveTudu}
        deleteTuduFn={deleteTudu}
        undoDeletionFn={restoreBackup}
        onEditPress={handleEditPress}
      />
      <NewTuduModal
        visible={newTuduPopupVisible}
        onRequestClose={() => {
          setNewTuduPopupVisible(false);
          setEditingTudu(undefined);
          closeCurrentlyOpenSwipeable();
        }}
        editingTudu={editingTudu}
      />
    </Page>
  );
};

export {AllTudusPage};
