import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HomePageProps,
  ListDataViewModel,
  SmartList,
} from './types';
import {  DraggableScrollablePageContent } from '../../components/draggable-page-content';
import { Page } from '../../components/page';
import { SmartLists } from './components/smart-lists';
import { useRecoilValue } from 'recoil';
import { homeDefaultLists } from './state';
import { HomeHeader } from './components/home-header';
import { useTranslation } from 'react-i18next';
import {
  LeftFadingGradient,
  PageContentContainer,
  RightFadingGradient,
  SectionTitle,
} from './styles';
import { CountersList } from './components/counters-list';
import { DraggableItem } from '../../modules/draggable/draggable-context/types';
import { CustomLists } from './components/custom-lists';
import { mapListToDraggableItems } from '../../modules/draggable/draggable-utils';
import { DraxProvider } from 'react-native-drax';
import { FloatingDelete } from '../../components/floating-delete';
import { DraggableContextProvider } from '../../modules/draggable/draggable-context';
import { useTheme } from 'styled-components/native';
import { generateListAndGroupDeleteTitle } from '../../utils/list-and-group-utils';
import { FloatingActionButtonRef } from '../../components/floating-action-button/types';
import { HomeActionButton } from './components/home-action-button';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { ForwardedRefAnimatedIcon } from '../../components/animated-icons/animated-icon/types';
import { useListService } from '../../service/list-service-hook/useListService';
import { useCounterService } from '../../service/counter-service-hook/useCounterService';
import { OnboardingModal } from './components/onboarding-modal';
import { getDateOnlyTimeStamp } from '../../utils/date-utils';

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
  const smartLists = useRecoilValue(homeDefaultLists);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const { t } = useTranslation();
  const theme = useTheme();

  const { getAllLists, saveAllLists, deleteList, restoreBackup, getAllRecurrentTudusToUpdate, saveAllTudus } =
    useListService();
  const { getAllCounters } = useCounterService();

  const animateThisIcon = useCallback((Icon: ForwardedRefAnimatedIcon) => {
    actionButtonRef.current?.animateThisIcon(Icon);
  }, []);

  // Filters all tudus with recurrence and last date past today to update their date
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const recurrentTudusToUpdate = getAllRecurrentTudusToUpdate();
    recurrentTudusToUpdate.forEach(tudu => {
      if (!tudu.dueDate || !tudu.recurrence) return;

      let nextDueDate = new Date(tudu.dueDate);

      while (nextDueDate < today) {
        switch (tudu.recurrence) {
          case 'daily':
            nextDueDate = today;
            break;
          case 'weekly':
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
          case 'monthly':
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
          case 'yearly':
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
          default:
            break;
        }
      }

      const isDailyAndIsOutdated = tudu.recurrence === 'daily' && tudu.dueDate < today;

      if (isDailyAndIsOutdated || (['weekly', 'monthly', 'yearly'].includes(tudu.recurrence) && getDateOnlyTimeStamp(tudu.dueDate) <= getDateOnlyTimeStamp(tomorrow))) {
        tudu.done = false;
      }

      tudu.dueDate = nextDueDate;
    });

    if (recurrentTudusToUpdate.length === 0) return;

    saveAllTudus(recurrentTudusToUpdate);

  }, []);

  const mapDraggableItemsToList = (
    newOrderList: DraggableItem<ListDataViewModel>[],
    groupPropertySetter: (
      obj: ListDataViewModel,
      groupId: string | undefined,
    ) => void,
  ) => {
    for (let itemIndex in newOrderList) {
      const item = newOrderList[itemIndex];

      if (item.groupId) {
        for (let subItemIndex in item.data) {
          const subItem = item.data[subItemIndex];
          groupPropertySetter(subItem, item.groupId);
          item.data[subItemIndex] = subItem;
        }
      } else {
        item.groupId = undefined;
        const onlyItem = item.data[0];
        groupPropertySetter(onlyItem, undefined);
        item.data = [onlyItem];
      }
    }

    return newOrderList.flatMap(item => item.data);
  };

  const handleSetCustomLists = useCallback(
    (newOrderList: DraggableItem<ListDataViewModel>[]) => {
      const mappedList = mapDraggableItemsToList(
        newOrderList,
        (list: ListDataViewModel, groupName) => (list.groupName = groupName),
      );
      saveAllLists(mappedList);
    },
    [saveAllLists],
  );

  const groupedCustomLists = useMemo(() => {
    return mapListToDraggableItems(
      getAllLists() ?? [],
      (list: ListDataViewModel) => list.groupName,
    ) as DraggableItem<ListDataViewModel>[];
  }, [getAllLists]);

  const handleListDragStart = useCallback(() => {
    RNReactNativeHapticFeedback.trigger('soft');
    setDeleteVisible(true);
  }, []);

  const handleListDragEnd = useCallback(() => {
    setDeleteVisible(false);
  }, []);

  const handleListPress = useCallback(
    (listData: ListDataViewModel) => {
      navigation.navigate('List', {
        listId: listData.id,
        title: listData.label,
        listOrigin: listData.origin,
        numberOfUndoneTudus: listData.numberOfActiveItems,
      });
    },
    [navigation],
  );

  const handleDefaultListPress = useCallback(
    (listData: SmartList, numberOfUndoneTudus?: number) => {
      navigation.navigate(listData.navigateToPage, {
        numberOfUndoneTudus,
      });
    },
    [navigation],
  );

  const handleDeleteListOrGroup = useCallback(
    (lists: ListDataViewModel[]) => {
      lists.forEach(x => deleteList(x));
    },
    [deleteList],
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const countersList = useMemo(() => getAllCounters(), [getAllCounters]);

  return (
    <Page>
      <OnboardingModal />
      <HomeHeader onSearchPress={handleSearchPress} />
      <DraxProvider>
        <DraggableContextProvider<ListDataViewModel>
          data={groupedCustomLists}
          onSetData={handleSetCustomLists}
          onDragStart={handleListDragStart}
          onDragEnd={handleListDragEnd}>
          <DraggableScrollablePageContent
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled>
            <PageContentContainer>
              <SmartLists
                lists={smartLists}
                onListPress={handleDefaultListPress}
              />
              {countersList.length ? (
                <>
                  <SectionTitle title={t('sectionTitles.counters')} />
                  <CountersList
                    list={countersList}
                    animateIcon={animateThisIcon}
                  />
                </>
              ) : (
                <></>
              )}
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
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                colors={theme.colors.scrollFadeGradientColorsPageBackground}
                pointerEvents={'none'}
              />
              <RightFadingGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={theme.colors.scrollFadeGradientColorsPageBackground}
                pointerEvents={'none'}
              />
            </PageContentContainer>
          </DraggableScrollablePageContent>
          <FloatingDelete
            visible={deleteVisible}
            confirmationPopupTitleBuilder={generateListAndGroupDeleteTitle}
            animateIcon={animateThisIcon}
            deleteItemsFn={handleDeleteListOrGroup}
            undoDeletionFn={restoreBackup}
          />
          <HomeActionButton ref={actionButtonRef} />
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

export { HomePage };
