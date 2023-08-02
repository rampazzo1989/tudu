import React, {useCallback, useMemo, useState} from 'react';
import {HomePageProps, List} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilState, useRecoilValue} from 'recoil';
import {counters, homeDefaultLists, myLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {SectionTitle, styles} from './styles';
import {CountersList} from './components/counters-list';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {CustomLists} from './components/custom-lists';
import {
  mapDraggableItemsToList,
  mapListToDraggableItems,
} from '../../modules/draggable/draggable-utils';
import {DraxProvider, DraxScrollView} from 'react-native-drax';
import {FloatingDelete} from '../../components/floating-delete';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {BlurredModal} from '../../components/blurred-modal';
import {Text, View} from 'react-native';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const {t} = useTranslation();

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<List>[]) => {
      const mappedList = mapDraggableItemsToList(newOrderList, 'groupName');
      setCustomLists(mappedList);
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
      <HomeHeader />
      <DraxProvider>
        <DraggableContextProvider<List>
          data={groupedCustomLists}
          onSetData={handleSetCustomLists}
          onDragStart={handleListDragStart}
          onDragEnd={handleListDragEnd}>
          <PageContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
            scrollEnabled>
            <DefaultLists lists={lists} />
            <SectionTitle title={t('sectionTitles.counters')} />
            <CountersList list={counterList} />
            <SectionTitle title={t('sectionTitles.myLists')} />
            <CustomLists data={groupedCustomLists} />
          </PageContent>
          <FloatingDelete
            visible={deleteVisible}
            confirmationPopupTitleBuilder={item => {
              console.log(item);

              return (
                `Confirm deletion of list ${item?.data?.[0]?.label}?` ?? 'Teste'
              );
            }}
          />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

export {HomePage};
