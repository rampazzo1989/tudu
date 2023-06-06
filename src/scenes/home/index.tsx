import React, {useEffect} from 'react';
import {View} from 'react-native';
import {HomePageProps} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilValue} from 'recoil';
import {homeDefaultLists} from './state';
import {HomeHeader} from './components/home-header';
import {idlyAnimatedComponents} from '../../state/atoms';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const idlyAnimatedRefs = useRecoilValue(idlyAnimatedComponents);

  useEffect(() => {
    if (idlyAnimatedRefs.length) {
      console.log({lenght: idlyAnimatedRefs[0].componentRef?.current});
      setInterval(() => {
        const lastIndex = idlyAnimatedRefs.length;
        const randomNumber = Math.floor(Math.random() * lastIndex);
        console.log({lastIndex, randomNumber});

        const initialFrame = idlyAnimatedRefs[randomNumber].initialFrame ?? 0;
        const finalFrame = idlyAnimatedRefs[randomNumber].finalFrame ?? 500;
        idlyAnimatedRefs[randomNumber].componentRef?.current?.play(
          initialFrame,
          finalFrame,
        );
      }, 4000);
    }
  }, [idlyAnimatedRefs]);

  return (
    <Page>
      <HomeHeader />
      <PageContent>
        <DefaultLists lists={lists} />
      </PageContent>
    </Page>
  );
};

export {HomePage};
