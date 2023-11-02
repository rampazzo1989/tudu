import React, {memo, useCallback, useMemo} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListPageCore} from '../../components/list-page-core';
import {ScheduledListPageProps} from './types';
import {useScheduledTuduService} from '../../service/list-service-hook/useScheduledTuduService';

const ScheduledListPage: React.FC<ScheduledListPageProps> = memo(
  ({navigation, route}) => {
    const {date} = route.params;

    const {saveList} = useListService();

    const {getTudusForDate} = useScheduledTuduService();

    const handleBackButtonPress = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const list = useMemo(() => {
      const tudusForDate = getTudusForDate(date);

      const scheduledListVM = new ListViewModel({
        id: 'scheduled',
        label: date.toLocaleDateString('pt-BR'),
        numberOfActiveItems: 0,
        tudus: new Map(),
      });

      scheduledListVM.tudus = tudusForDate;

      return scheduledListVM;
    }, [date, getTudusForDate]);

    const setTudus = useCallback(
      (draggable: DraggableItem<TuduViewModel>[]) => {
        if (!list) {
          return;
        }

        const newTuduList = draggable.flatMap(x => x.data);
        const newList = new ListViewModel(list.mapBack(), list.origin);
        newList.tudus = newTuduList;
        saveList(newList);
      },
      [list, saveList],
    );

    return (
      <ListPageCore
        handleBackButtonPress={handleBackButtonPress}
        setTudus={setTudus}
        list={list}
      />
    );
  },
);

export {ScheduledListPage};
