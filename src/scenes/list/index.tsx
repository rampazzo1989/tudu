import React, {memo, useCallback, useMemo} from 'react';
import {DraxProvider} from 'react-native-drax';
import {useRecoilValue} from 'recoil';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {
  archivedLists as archivedListsState,
  homeDefaultLists,
  myLists,
} from '../home/state';
import {BuiltInList, List} from '../home/types';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';
import {TudusList} from './components/tudus-list';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;

  const defaultLists = useRecoilValue(homeDefaultLists);
  const customLists = useRecoilValue(myLists);
  const archivedLists = useRecoilValue(archivedListsState);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list: BuiltInList | List | undefined = useMemo(() => {
    const selectedListFromDefault = defaultLists.find(x => x.label === listId);

    if (selectedListFromDefault) {
      return selectedListFromDefault;
    }

    const customList = customLists.find(x => x.label === listId);

    if (customList) {
      return customList;
    }

    return archivedLists.find(x => x.label === listId);
  }, [archivedLists, customLists, defaultLists, listId]);

  return (
    <Page>
      <ListHeader listData={list} onBackButtonPress={handleBackButtonPress} />
      <DraxProvider>
        <DraggablePageContent>
          {!!list?.tudus && <TudusList data={list.tudus} />}
        </DraggablePageContent>
      </DraxProvider>
    </Page>
  );
});

export {ListPage};
