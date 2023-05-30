import React from 'react';
import {View} from 'react-native';
import {HomePageProps} from './types';
import {PageContent} from '../../components/page-content';
import {Header} from '../../components/header';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilValue} from 'recoil';
import {homeDefaultLists} from './state';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);

  return (
    <Page>
      <Header>
        <></>
      </Header>
      <PageContent>
        <DefaultLists lists={lists} />
      </PageContent>
    </Page>
  );
};

export {HomePage};
