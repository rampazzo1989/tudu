import React, {memo, useCallback, useMemo} from 'react';
import {DraxProvider} from 'react-native-drax';
import {useRecoilState} from 'recoil';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {myLists} from '../home/state';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;

  const [lists, setLists] = useRecoilState(myLists);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    return lists.find(x => x.label === listId);
  }, [listId, lists]);

  return (
    <Page>
      <ListHeader listData={list} onBackButtonPress={handleBackButtonPress} />
      <DraxProvider>
        <PageContent />
      </DraxProvider>
    </Page>
  );
});

export {ListPage};
