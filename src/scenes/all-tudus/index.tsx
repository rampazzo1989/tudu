import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListDefaultIcon} from '../../components/animated-icons/list-default-icon';
import {ListPageCore} from '../../components/list-page-core';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListViewModel, TuduViewModel} from '../home/types';
import {AllTudusPageProps} from './types';

const AllTudusPage: React.FC<AllTudusPageProps> = ({navigation}) => {
  const {t} = useTranslation();

  const {saveAllTudus, getAllTudus} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    const allTudus = getAllTudus();

    const virtualListVM = new ListViewModel({
      id: 'all',
      label: 'All Tudús',
      tudus: new Map(),
    });

    virtualListVM.tudus = allTudus ?? [];

    return virtualListVM;
  }, [getAllTudus]);

  const setTudus = useCallback(
    (draggable: DraggableItem<TuduViewModel>[]) => {
      if (!list) {
        return;
      }

      const newTuduList = draggable.flatMap(x => x.data);

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
      allowAdding={false}
    />
  );
};

export {AllTudusPage};
