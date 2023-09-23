import React, {useCallback, useEffect} from 'react';
import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {DefaultHeader} from '../../components/default-header';
import {Page} from '../../components/page';
import {ArchivedPageProps} from './types';
import {PageContent} from '../../components/page-content';
import {ArchivedLists} from './components/archived-lists';
import {useRecoilState} from 'recoil';
import {archivedLists} from '../home/state';
import {List} from '../home/types';
import {styles} from '../home/styles';

const ArchivedPage: React.FC<ArchivedPageProps> = ({navigation}) => {
  const [archivedListsState, setArchivedListsState] =
    useRecoilState(archivedLists);

  useEffect(() => {
    console.log('State', archivedListsState);
  }, [archivedListsState]);

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleListPress = useCallback(
    (listData: List) => {
      navigation.navigate('List', {listId: listData.label});
    },
    [navigation],
  );

  return (
    <Page>
      <DefaultHeader
        Icon={FolderIcon}
        title={'Archived Lists'}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <ArchivedLists
          data={archivedListsState}
          onListPress={handleListPress}
        />
      </PageContent>
    </Page>
  );
};

export {ArchivedPage};
