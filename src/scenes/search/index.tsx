import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NewTuduModal} from '../../components/new-tudu-modal';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {SimpleTuduList} from '../../components/simple-tudu-list';
import {SkeletonTuduList} from '../../components/skeleton-tudu-list';
import {TuduAdditionalInformation} from '../../components/tudu-card/types';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {useListService} from '../../service/list-service-hook/useListService';
import {useSearchService} from '../../service/list-service-hook/useSearchService';
import {formatToLocaleDate, isToday} from '../../utils/date-utils';
import {UNLISTED} from '../home/state';
import {ListViewModel, TuduViewModel} from '../home/types';
import {SearchHeader} from './components/search-header';
import {styles} from './styles';
import {SearchPageProps} from './types';

const SearchPage: React.FC<SearchPageProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>();

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
  const [searchText, setSearchText] = useState('');

  const {saveTudu, deleteTudu, restoreBackup} = useListService();

  const {searchTudus} = useSearchService();

  const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const delayDebounceFn = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }
    setTudus(current => (current?.length ? current : undefined));
    delayDebounceFn.current = setTimeout(() => {
      const result = searchTudus(searchText);
      setTudus(result ?? []);
    }, 1000);
  }, [searchText, searchTudus, setTudus]);

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
      id: 'search',
      label: 'Search tudús',
    });
    return list;
  }, []);

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  return (
    <Page>
      <SearchHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        onTextChange={handleTextChange}
      />
      <PageContent contentContainerStyle={styles.pageContent}>
        {!tudus ? (
          <SkeletonTuduList />
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

export {SearchPage};
