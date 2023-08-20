import React, {useCallback, useMemo, useRef, useState} from 'react';
import {HomePageProps, List} from './types';
import {PageContent} from '../../components/page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilState, useRecoilValue} from 'recoil';
import {counters, homeDefaultLists, myLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {
  BottomFadingGradient,
  SectionTitle,
  styles,
  TopFadingGradient,
} from './styles';
import {CountersList} from './components/counters-list';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {CustomLists} from './components/custom-lists';
import {
  mapDraggableItemsToList,
  mapListToDraggableItems,
} from '../../modules/draggable/draggable-utils';
import {DraxProvider} from 'react-native-drax';
import {FloatingDelete} from '../../components/floating-delete';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {useTheme} from 'styled-components/native';
import {generateListAndGroupDeleteTitle} from '../../utils/list-and-group-utils';
import {FloatingActionButtonRef} from '../../components/floating-action-button/types';
import {HomeActionMenuOptions} from './components/button-actions';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const {t} = useTranslation();
  const theme = useTheme();

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
  const handleListDragEnd = useCallback(() => {
    setDeleteVisible(false);
  }, []);

  const handleCreateNewList = useCallback(() => {
    
  }, []);

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
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContentContainer}
            scrollEnabled>
            <DefaultLists lists={lists} />
            <SectionTitle title={t('sectionTitles.counters')} />
            <CountersList list={counterList} />
            {groupedCustomLists.length ? (
              <>
                <SectionTitle title={t('sectionTitles.myLists')} />
                <CustomLists data={groupedCustomLists} />
              </>
            ) : (
              <></>
            )}
          </PageContent>
          <TopFadingGradient
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            colors={theme.colors.scrollFadeGradientColors}
            pointerEvents={'none'}
          />
          <BottomFadingGradient
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            colors={theme.colors.scrollFadeGradientColors}
            pointerEvents={'none'}
          />
          <FloatingDelete
            visible={deleteVisible}
            confirmationPopupTitleBuilder={generateListAndGroupDeleteTitle}
          />
          <HomeActionMenuOptions
            onCreateNewList={handleCreateNewList}
            ref={actionButtonRef}
          />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

export {HomePage};
