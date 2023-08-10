import React, {useCallback, useMemo, useState} from 'react';
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
  isNestedItem,
  mapDraggableItemsToList,
  mapListToDraggableItems,
} from '../../modules/draggable/draggable-utils';
import {DraxProvider} from 'react-native-drax';
import {FloatingDelete} from '../../components/floating-delete';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {useTheme} from 'styled-components/native';
import {FloatingActionButton} from '../../components/floating-action-button';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const [deleteVisible, setDeleteVisible] = useState(false);
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
  const handleListDragEnd = useCallback(() => setDeleteVisible(false), []);

  const handleDeleteList = useCallback(
    (item?: DraggableItem<List> | List) => {
      if (!item) {
        return '';
      }
      let listName: string;
      let itemType: string = t('messages.confirmDeleteItemType.list');
      if (isNestedItem(item)) {
        listName = (item as List).label;
      } else {
        const draggableItem = item as DraggableItem<List>;
        listName = draggableItem.groupId ?? draggableItem.data[0].label;
        itemType = draggableItem.groupId
          ? t('messages.confirmDeleteItemType.group')
          : itemType;
      }
      return t('messages.confirmDelete', {itemType, listName});
    },
    [t],
  );

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
            <SectionTitle title={t('sectionTitles.myLists')} />
            <CustomLists data={groupedCustomLists} />
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
            confirmationPopupTitleBuilder={handleDeleteList}
          />
          <FloatingActionButton />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

export {HomePage};
