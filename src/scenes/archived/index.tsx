import React, {useCallback} from 'react';
import {DraxProvider} from 'react-native-drax';
import {FolderIcon} from '../../components/animated-icons/folder-icon';
import {DefaultHeader} from '../../components/default-header';
import {Page} from '../../components/page';
import {PageContent} from '../../components/page-content';
import {ArchivedPageProps} from './types';

const ArchivedPage: React.FC<ArchivedPageProps> = ({navigation}) => {
  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Page>
      <DefaultHeader
        Icon={FolderIcon}
        title={'Archived PAGE'}
        onBackButtonPress={handleBackButtonPress}
      />
      <DraxProvider>
        <PageContent />
      </DraxProvider>
    </Page>
  );
};

export {ArchivedPage};
