import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {ListPageCore} from '../../components/list-page-core';
import {ScheduledListPageProps} from './types';
import {useScheduledTuduService} from '../../service/list-service-hook/useScheduledTuduService';
import {formatToLocaleDate, isToday, isOutdated} from '../../utils/date-utils';
import {getDaytimeIcon} from '../../utils/general-utils';
import {UNLISTED} from '../home/state';
import {UNLOADED_ID} from '../../constants';
import { useRecoilState } from 'recoil';
import { showOutdatedTudus } from '../../state/atoms';
import { OutdatedTudusList } from './components/outdated-tudus-list';
import {useTranslation} from 'react-i18next';

const ScheduledListPage: React.FC<ScheduledListPageProps> = memo(
  ({navigation, route}) => {
    const date = useMemo(
      () => route.params?.date ?? new Date(),
      [route.params?.date],
    );
    const {t} = useTranslation();
    const [showOutdated] = useRecoilState(showOutdatedTudus);
    const [outdatedTudus, setOutdatedTudus] = useState<TuduViewModel[]>([]);
    const {getTudusForDate, saveAllScheduledTudus} = useScheduledTuduService();

    const handleBackButtonPress = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const getListTitle = useCallback(
      () => (isToday(date) ? t('listTitles.today') : formatToLocaleDate(date)),
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
        const tudusWithOutdated = getTudusForDate(date, true);
        const tudusForDate = tudusWithOutdated.filter(tudu => tudu.dueDate && !isOutdated(tudu.dueDate));
        const outdated = tudusWithOutdated.filter(tudu => tudu.dueDate && isOutdated(tudu.dueDate));
          
        setOutdatedTudus(outdated);

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
    }, [date, getListTitle, getTudusForDate, showOutdated]);

    const setTudus = useCallback(
      (tudus: TuduViewModel[]) => {
        if (!list) {
          return;
        }

        tudus.forEach(tudu => {
          if (!tudu.listId) {
            tudu.dueDate = date;
            tudu.listId = UNLISTED;
          }
        });

        saveAllScheduledTudus(tudus);
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
        numberOfUndoneTudus={route.params?.numberOfUndoneTudus}
        TopComponent={outdatedTudus.length ? (<OutdatedTudusList tudus={outdatedTudus} showUpToDateHeader={!!list.tudus.length} />) : undefined}
      />
    );
  },
);

export {ScheduledListPage};
