import React, {useCallback} from 'react';
import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {DefaultHeader} from '../../components/default-header';
import {Page} from '../../components/page';
import {ArchivedPageProps} from './types';
import {PageContent} from '../../components/page-content';
import {ArchivedLists} from './components/archived-lists';
import {ListDataViewModel, ListViewModel} from '../home/types';
import {styles} from '../home/styles';
import {useListService} from '../../service/list-service-hook/useListService';
import {useTranslation} from 'react-i18next';

const ArchivedPage: React.FC<ArchivedPageProps> = ({navigation}) => {
  const {getAllLists} = useListService();
  const {t} = useTranslation();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleListPress = useCallback(
    (listData: ListDataViewModel) => {
      navigation.navigate('List', {
        listId: listData.id,
        title: listData.label,
        listOrigin: 'archived',
      });
    },
    [navigation],
  );

  return (
    <Page>
      <DefaultHeader
        Icon={FolderIcon}
        title={t('listPageTitles.archived')}
        onBackButtonPress={handleBackButtonPress}
      />
      <PageContent contentContainerStyle={styles.scrollContentContainer}>
        <ArchivedLists
          data={getAllLists('archived') ?? []}
          onListPress={handleListPress}
        />
      </PageContent>
    </Page>
  );
};

export {ArchivedPage};
