import React from 'react';
import {HomePageProps} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilValue} from 'recoil';
import {homeDefaultLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {SectionTitle} from './styles';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);

  const {t} = useTranslation();

  return (
    <Page>
      <HomeHeader />
      <PageContent>
        <DefaultLists lists={lists} />
        <SectionTitle title={t('sectionTitles.counters')} />
      </PageContent>
    </Page>
  );
};

export {HomePage};
