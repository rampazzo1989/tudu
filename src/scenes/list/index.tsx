import React, {memo, useCallback, useMemo} from 'react';
import {DraxProvider} from 'react-native-drax';
import {useRecoilValue} from 'recoil';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {homeDefaultLists, myLists} from '../home/state';
import {BuiltInList, List} from '../home/types';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;

  const defaultLists = useRecoilValue(homeDefaultLists);
  const customLists = useRecoilValue(myLists);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list: BuiltInList | List | undefined = useMemo(() => {
    const selectedListFromDefault = defaultLists.find(x => x.label === listId);

    if (selectedListFromDefault) {
      return selectedListFromDefault;
    }

    return customLists.find(x => x.label === listId);
  }, [customLists, defaultLists, listId]);

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
