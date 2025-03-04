import React, {memo, useCallback, useEffect, useState} from 'react';
import {ListViewModel, TuduViewModel} from '../home/types';
import {ListPageProps} from './types';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {ListPageCore} from '../../components/list-page-core';
import {UNLOADED_ID} from '../../constants';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId, title, listOrigin} = route.params;

  const [list, setList] = useState<ListViewModel | undefined>(
    new ListViewModel({
      id: UNLOADED_ID,
      label: title,
    }),
  );

  const {getListById, saveListAndTudus} = useListService();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    var a = getListById(listId, listOrigin);
    console.log('LIST AT LIST PAGE', {a});
    setTimeout(() => {
      setList(a);
    }, 100);
  }, [getListById, listId, listOrigin]);

  const setTudus = useCallback(
    (tudus: TuduViewModel[]) => {
      if (!list) {
        return;
      }

      const newList = new ListViewModel(
        list.mapBackList(),
        undefined,
        list.origin,
      );
      newList.tudus = tudus;
      saveListAndTudus(newList);
    },
    [list, saveListAndTudus],
  );

  return (
    <ListPageCore
      handleBackButtonPress={handleBackButtonPress}
      setTudus={setTudus}
      list={list}
      numberOfUndoneTudus={route.params?.numberOfUndoneTudus}
    />
  );
});

export {ListPage};
