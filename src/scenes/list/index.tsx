import React, {memo, useCallback, useMemo} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {ListPageProps} from './types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListPageCore} from '../../components/list-page-core';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId, listOrigin} = route.params;

  const {getListById, saveList} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    console.log({listId, listOrigin});
    return getListById(listId, listOrigin);
  }, [getListById, listId, listOrigin]);

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
});

export {ListPage};
