import React, {memo, useCallback, useMemo} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListPageCore} from '../../components/list-page-core';
import {ScheduledListPageProps} from './types';
import {useScheduledTuduService} from '../../service/list-service-hook/useScheduledTuduService';
import {isToday} from '../../utils/date-utils';
import {getDaytimeIcon} from '../../utils/general-utils';

const ScheduledListPage: React.FC<ScheduledListPageProps> = memo(
  ({navigation, route}) => {
    const date = useMemo(
      () => route.params?.date ?? new Date(),
      [route.params?.date],
    );

    const {getTudusForDate, saveAllScheduledTudus} = useScheduledTuduService();

    const handleBackButtonPress = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const getListTitle = useCallback(
      () => (isToday(date) ? 'Today' : date.toLocaleDateString('pt-BR')),
      [date],
    );

    const list = useMemo(() => {
      const tudusForDate = getTudusForDate(date);

      const scheduledListVM = new ListViewModel({
        id: 'scheduled',
        label: getListTitle(),
        numberOfActiveItems: 0,
        tudus: new Map(),
      });

      scheduledListVM.tudus = tudusForDate;

      return scheduledListVM;
    }, [date, getListTitle, getTudusForDate]);

    const setTudus = useCallback(
      (draggable: DraggableItem<TuduViewModel>[]) => {
        if (!list) {
          return;
        }

        const newTuduList = draggable.flatMap(x => x.data);

        saveAllScheduledTudus(newTuduList);
      },
      [list, saveAllScheduledTudus],
    );

    return (
      <ListPageCore
        handleBackButtonPress={handleBackButtonPress}
        setTudus={setTudus}
        list={list}
        Icon={getDaytimeIcon()}
      />
    );
  },
);

export {ScheduledListPage};
