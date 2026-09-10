import React, {memo, useCallback, useEffect, useState} from 'react';
import {ListViewModel, TuduViewModel, cloneList} from '../home/types';
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
    if (list?.id === UNLOADED_ID) {
      const foundList = getListById(listId, listOrigin);
      setList(foundList);
    }
  }, [getListById, listId, listOrigin, list?.id]);

  const setTudus = useCallback(
    (tudus: TuduViewModel[]) => {
      setList(current => {
        if (!current) {
          return current;
        }

        const newList = cloneList(current);
        newList.tudus = tudus;
        return newList;
      });
    },
    [],
  );

  return (
    <ListPageCore
      handleBackButtonPress={handleBackButtonPress}
      setTudus={setTudus}
      onUpdateList={setList}
      list={list}
      defaultListId={listId}
      defaultOrigin={listOrigin || 'default'}
      numberOfUndoneTudus={route.params?.numberOfUndoneTudus}
    />
  );
});

ListPage.displayName = 'ListPage';

export {ListPage};
