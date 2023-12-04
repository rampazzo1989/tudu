import React, {memo, useCallback, useEffect, useState} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {ListPageProps} from './types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListPageCore} from '../../components/list-page-core';

const UNLOADED_ID = 'unloaded';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId, title, listOrigin} = route.params;

  const [list, setList] = useState<ListViewModel | undefined>(
    new ListViewModel({
      id: UNLOADED_ID,
      label: title,
    }),
  );

  const {getListById, saveList} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      setList(() => getListById(listId, listOrigin));
    }, 100);
  }, [getListById, listId, listOrigin]);

  const setTudus = useCallback(
    (draggable: DraggableItem<TuduViewModel>[]) => {
      if (!list) {
        return;
      }

      const newTuduList = draggable.flatMap(x => x.data);
      const newList = new ListViewModel(
        list.mapBackList(),
        undefined,
        list.origin,
      );
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
      loading={list?.id === UNLOADED_ID}
    />
  );
});

export {ListPage};
