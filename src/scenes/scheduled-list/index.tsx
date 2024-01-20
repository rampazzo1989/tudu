import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {ListPageCore} from '../../components/list-page-core';
import {ScheduledListPageProps} from './types';
import {useScheduledTuduService} from '../../service/list-service-hook/useScheduledTuduService';
import {formatToLocaleDate, isToday} from '../../utils/date-utils';
import {getDaytimeIcon} from '../../utils/general-utils';
import {UNLISTED} from '../home/state';
import {UNLOADED_ID} from '../../constants';

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
      () => (isToday(date) ? 'Today' : formatToLocaleDate(date)),
      [date],
    );

    const [list, setList] = useState<ListViewModel>(
      new ListViewModel(
        {
          id: UNLOADED_ID,
          label: getListTitle(),
        },
        new Map(),
      ),
    );

    useEffect(() => {
      setTimeout(() => {
        const tudusForDate = getTudusForDate(date);

        setList(() => {
          const virtualListVM = new ListViewModel(
            {
              id: 'scheduled',
              label: getListTitle(),
            },
            new Map(),
          );
          virtualListVM.tudus = tudusForDate ?? [];
          return virtualListVM;
        });
      }, 100);
    }, [date, getListTitle, getTudusForDate]);

    const setTudus = useCallback(
      (draggable: DraggableItem<TuduViewModel>[]) => {
        if (!list) {
          return;
        }

        const newTuduList = draggable.flatMap(x => x.data);

        newTuduList.forEach(tudu => {
          if (!tudu.listId) {
            tudu.dueDate = date;
            tudu.listId = UNLISTED;
          }
        });

        saveAllScheduledTudus(newTuduList);
      },
      [date, list, saveAllScheduledTudus],
    );

    return (
      <ListPageCore
        handleBackButtonPress={handleBackButtonPress}
        setTudus={setTudus}
        list={list}
        Icon={getDaytimeIcon()}
        isSmartList
        showScheduleInformation={false}
        numberOfUndoneTudus={route.params?.numberOfUndoneTudus}
      />
    );
  },
);

export {ScheduledListPage};
