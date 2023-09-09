import React, {memo, useCallback, useMemo} from 'react';
import {DraxProvider} from 'react-native-drax';
import {useRecoilValue} from 'recoil';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {getListByLabel} from '../home/state';
import {ListHeader} from './components/list-header';
import {ListPageProps} from './types';

const ListPage: React.FC<ListPageProps> = memo(({navigation, route}) => {
  const {listId} = route.params;

  const getList = useRecoilValue(getListByLabel);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const list = useMemo(() => {
    return getList(listId);
  }, [getList, listId]);

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
