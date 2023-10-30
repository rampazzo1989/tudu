import React, {useCallback, useMemo, useRef, useState} from 'react';
import {HomePageProps, ListViewModel, SmartList} from './types';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilValue} from 'recoil';
import {homeDefaultLists} from './state';
import {HomeHeader} from './components/home-header';
import {useTranslation} from 'react-i18next';
import {
  LeftFadingGradient,
  RightFadingGradient,
  SectionTitle,
  styles,
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
import {HomeActionButton} from './components/home-action-button';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {ForwardedRefAnimatedIcon} from '../../components/animated-icons/animated-icon/types';
import {useListService} from '../../service/list-service-hook/useListService';
import {useCounterService} from '../../service/counter-service-hook/useCounterService';

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const smartLists = useRecoilValue(homeDefaultLists);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const {t} = useTranslation();
  const theme = useTheme();

  const {getAllLists, saveAllLists} = useListService();
  const {getAllCounters} = useCounterService();

  const animateThisIcon = useCallback((Icon: ForwardedRefAnimatedIcon) => {
    actionButtonRef.current?.animateThisIcon(Icon);
  }, []);

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<ListViewModel>[]) => {
      const mappedList = mapDraggableItemsToList(
        newOrderList,
        (list: ListViewModel, groupName) => (list.groupName = groupName),
      );
      saveAllLists(mappedList);
    },
    [saveAllLists],
  );

  const groupedCustomLists = useMemo(() => {
    return mapListToDraggableItems(
      getAllLists(),
      (list: ListViewModel) => list.groupName,
    ) as DraggableItem<ListViewModel>[];
  }, [getAllLists]);

  const handleListDragStart = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('soft');
    setDeleteVisible(true);
  }, []);

  const handleListDragEnd = useCallback(() => {
    setDeleteVisible(false);
  }, []);

  const handleListPress = useCallback(
    (listData: ListViewModel) => {
      navigation.navigate('List', {listId: listData.id});
    },
    [navigation],
  );

  const handleSmartListPress = useCallback(
    (listData: SmartList) => {
      navigation.navigate(listData.navigateToPage, {listId: listData.id});
    },
    [navigation],
  );

  const handleDefaultListPress = useCallback(
    (listData: SmartList) => {
      handleSmartListPress(listData);
    },
    [handleSmartListPress],
  );

  const countersList = useMemo(() => getAllCounters(), [getAllCounters]);

  return (
    <Page>
      <HomeHeader />
      <DraxProvider>
        <DraggableContextProvider<ListViewModel>
          data={groupedCustomLists}
          onSetData={handleSetCustomLists}
          onDragStart={handleListDragStart}
          onDragEnd={handleListDragEnd}>
          <DraggablePageContent
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContentContainer}
            scrollEnabled>
            <DefaultLists
              lists={smartLists}
              onListPress={handleDefaultListPress}
            />
            <SectionTitle title={t('sectionTitles.counters')} />
            <CountersList list={countersList} animateIcon={animateThisIcon} />
            {groupedCustomLists.length ? (
              <>
                <SectionTitle title={t('sectionTitles.myLists')} />
                <CustomLists
                  onListPress={handleListPress}
                  animateIcon={animateThisIcon}
                />
              </>
            ) : (
              <></>
            )}

            <LeftFadingGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              colors={theme.colors.scrollFadeGradientColorsPageBackground}
              pointerEvents={'none'}
            />
            <RightFadingGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={theme.colors.scrollFadeGradientColorsPageBackground}
              pointerEvents={'none'}
            />
          </DraggablePageContent>
          <FloatingDelete
            visible={deleteVisible}
            confirmationPopupTitleBuilder={generateListAndGroupDeleteTitle}
            animateIcon={animateThisIcon}
          />
          <HomeActionButton ref={actionButtonRef} />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

export {HomePage};
