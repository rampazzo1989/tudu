import React, {useCallback, useMemo, useState} from 'react';
import {HomePageProps, List} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilState, useRecoilValue} from 'recoil';
import {counters, homeDefaultLists, myLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {SectionTitle} from './styles';
import {CountersList} from './components/counters-list';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {CustomLists} from './components/custom-lists';
import {mapListToDraggableItems} from '../../modules/draggable/draggable-utils';
import {DraxScrollView} from 'react-native-drax';
import {FloatingDelete} from '../../components/floating-delete';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const {t} = useTranslation();

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<List>[]) => {
      console.log({newOrderList});

      for (let itemIndex in newOrderList) {
        const item = newOrderList[itemIndex];
        if (item.groupId) {
          for (let subItemIndex in item.data) {
            item.data[subItemIndex] = {
              ...item.data[subItemIndex],
              groupName: item.groupId,
            };
          }
        } else {
          item.groupId = undefined;
          item.data[0].groupName = undefined;
        }
      }

      const flatList = newOrderList.flatMap(item => item.data);

      setCustomLists(flatList);
    },
    [setCustomLists],
  );

  const groupedCustomLists = useMemo(() => {
    return mapListToDraggableItems(
      customLists,
      'groupName',
      'label',
    ) as DraggableItem<List>[];
  }, [customLists]);

  const handleListDragStart = useCallback(() => setDeleteVisible(true), []);
  const handleListDragEnd = useCallback(() => setDeleteVisible(false), []);

  return (
    <Page>
      <DraxScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        scrollEnabled>
        <HomeHeader />
        <PageContent>
          <DefaultLists lists={lists} />
          <SectionTitle title={t('sectionTitles.counters')} />
          <CountersList list={counterList} />
          <SectionTitle title={t('sectionTitles.myLists')} />
          <CustomLists
            data={groupedCustomLists}
            onSetData={handleSetCustomLists}
            onDragStart={handleListDragStart}
            onDragEnd={handleListDragEnd}
          />
        </PageContent>
      </DraxScrollView>
      <FloatingDelete visible={deleteVisible} />
    </Page>
  );
};

export {HomePage};
