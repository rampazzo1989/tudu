import React, {useCallback, useMemo, useRef, useState} from 'react';
import {BuiltInList, HomePageProps, List} from './types';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {Page} from '../../components/page';
import {DefaultLists} from './components/default-lists';
import {useRecoilState, useRecoilValue} from 'recoil';
import {counters, homeDefaultLists, myLists} from './state';
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

const HomePage: React.FC<HomePageProps> = ({navigation}) => {
  const lists = useRecoilValue(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const counterList = useRecoilValue(counters);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const {t} = useTranslation();
  const theme = useTheme();

  const animateThisIcon = useCallback((Icon: ForwardedRefAnimatedIcon) => {
    actionButtonRef.current?.animateThisIcon(Icon);
  }, []);

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<List>[]) => {
      const mappedList = mapDraggableItemsToList(
        newOrderList,
        'groupName',
        'id',
      );
      const map = new Map<string, List>(mappedList);
      setCustomLists(map);
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

  const handleListDragStart = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('soft');
    setDeleteVisible(true);
  }, []);

  const handleListDragEnd = useCallback(() => {
    setDeleteVisible(false);
  }, []);

  const handleListPress = useCallback(
    (listData: List) => {
      navigation.navigate('List', {listId: listData.label});
    },
    [navigation],
  );

  const handleDefaultListPress = useCallback(
    (listData: BuiltInList) => {
      if (listData.navigateToPage) {
        navigation.navigate(listData.navigateToPage);
      } else {
        handleListPress(listData);
      }
    },
    [handleListPress, navigation],
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
          <DraggablePageContent
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContentContainer}
            scrollEnabled>
            <DefaultLists lists={lists} onListPress={handleDefaultListPress} />
            <SectionTitle title={t('sectionTitles.counters')} />
            <CountersList list={counterList} animateIcon={animateThisIcon} />
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
