import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {ListPageCore} from '../../components/list-page-core';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {UNLISTED} from '../home/state';
import {ListViewModel, TuduViewModel} from '../home/types';
import {AllTudusPageProps} from './types';

const UNLOADED_ID = 'unloaded';

const AllTudusPage: React.FC<AllTudusPageProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [list, setList] = useState<ListViewModel>(
    new ListViewModel(
      {
        id: UNLOADED_ID,
        label: 'All Tudús',
      },
      new Map(),
    ),
  );

  const {saveAllTudus, getAllUndoneTudus} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      const allTudus = getAllUndoneTudus();

      setList(() => {
        const virtualListVM = new ListViewModel(
          {
            id: 'all',
            label: 'All Tudús',
          },
          new Map(),
        );
        virtualListVM.tudus = allTudus ?? [];
        return virtualListVM;
      });
    }, 100);
  }, [getAllUndoneTudus]);

  const setTudus = useCallback(
    (draggable: DraggableItem<TuduViewModel>[]) => {
      if (!list) {
        return;
      }

      const newTuduList = draggable.flatMap(x => x.data);

      newTuduList.forEach(tudu => {
        if (!tudu.listId) {
          tudu.listId = UNLISTED;
        }
      });

      saveAllTudus(newTuduList);
    },
    [list, saveAllTudus],
  );

  return (
    <ListPageCore
      handleBackButtonPress={handleBackButtonPress}
      setTudus={setTudus}
      list={list}
      Icon={ListDefaultIcon}
      isSmartList
      draggableEnabled={false}
      allowAdding={true}
      loading={list.id === UNLOADED_ID}
    />
  );
};

export {AllTudusPage};
