import React from 'react';
import {HomePageProps} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilValue} from 'recoil';
import {counters, homeDefaultLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {SectionTitle} from './styles';
import {CountersList} from './components/counters-list';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const counterList = useRecoilValue(counters);

  const {t} = useTranslation();

  return (
    <Page>
      {'Ola'}
      <HomeHeader />
      <PageContent>
        <DefaultLists lists={lists} />
        <SectionTitle title={t('sectionTitles.counters')} />
        <CountersList list={counterList} />
        <SectionTitle title={t('sectionTitles.myLists')} />
      </PageContent>
    </Page>
  );
};

export {HomePage};
