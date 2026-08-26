import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  HomePageProps,
  ListDataViewModel,
  SmartList,
} from './types';
import {  DraggableScrollablePageContent } from '../../components/draggable-page-content';
import { Page } from '../../components/page';
import { SmartLists } from './components/smart-lists';
import { useRecoilState, useRecoilValue } from 'recoil';
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
import { BackupReminderBanner } from '../../components/backup-reminder-banner';
import { getDateOnlyTimeStamp } from '../../utils/date-utils';
import { updateRecurrentTudu } from '../../utils/tudu-utils';
import { recalculateRecurrence } from '../../state/atoms';
import { hasSeenHomeTour as hasSeenHomeTourState } from '../../state/onboarding';
import {
  SpotlightStep,
  SpotlightTarget,
  SpotlightTourProvider,
  useSpotlightTour,
} from '../../components/spotlight-tour';

const HomePageContent: React.FC<HomePageProps> = ({ navigation }) => {
  const smartLists = useRecoilValue(homeDefaultLists);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const actionButtonRef = useRef<FloatingActionButtonRef>(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const [recurrentTuduToRecalculate, setRecurrentTuduToRecalculate] = useRecoilState(recalculateRecurrence);
  const [hasSeenHomeTour, setHasSeenHomeTour] = useRecoilState(hasSeenHomeTourState);
  const { startTour } = useSpotlightTour();

  const { saveTudu, getAllLists, saveAllLists, deleteList, restoreBackup, getAllRecurrentTudusToUpdate, saveAllTudus } =
    useListService();
  const { getAllCounters } = useCounterService();

  const homeTourSteps = useMemo<SpotlightStep[]>(() => [
    {
      name: 'home_action_button',
      title: t('tour.home.createAction.title', { defaultValue: 'Criar Listas e Mais' }),
      description: t('tour.home.createAction.description', {
        defaultValue: 'Toque no botão + para criar novas listas, importar a partir de texto, organizar em grupos ou criar contadores.',
      }),
      icon: '➕',
      shape: 'circle',
      padding: 8,
      tooltipPosition: 'top',
    },
    {
      name: 'home_smart_lists',
      title: t('tour.home.smartLists.title', { defaultValue: 'Listas Inteligentes' }),
      description: t('tour.home.smartLists.description', {
        defaultValue: 'Veja o que tem para Hoje, próximos agendamentos, tarefas marcadas com estrela e todas as tarefas em um só lugar.',
      }),
      icon: '📅',
      shape: 'rect',
      borderRadius: 18,
      padding: 6,
      tooltipPosition: 'bottom',
    },
    {
      name: 'home_custom_lists',
      title: t('tour.home.customLists.title', { defaultValue: 'Minhas Listas' }),
      description: t('tour.home.customLists.description', {
        defaultValue: 'Suas listas personalizadas ficam aqui. Arraste e solte para reorganizar, agrupar ou deslize para opções rápidas.',
      }),
      icon: '📝',
      shape: 'rect',
      borderRadius: 18,
      padding: 6,
      tooltipPosition: 'top',
    },
    {
      name: 'home_header',
      title: t('tour.home.header.title', { defaultValue: 'Busca e Configurações' }),
      description: t('tour.home.header.description', {
        defaultValue: 'Pesquise tudús rapidamente e acesse configurações de backup na nuvem, bloqueio com PIN/biometria e IA.',
      }),
      icon: '⚙️',
      shape: 'rect',
      borderRadius: 16,
      padding: 6,
      tooltipPosition: 'bottom',
    },
  ], [t]);

  // Start the Home tour if the user has not seen it yet
  useEffect(() => {
    if (!hasSeenHomeTour) {
      const timer = setTimeout(() => {
        startTour(homeTourSteps, () => {
          setHasSeenHomeTour(true);
        });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [hasSeenHomeTour, startTour, setHasSeenHomeTour, homeTourSteps]);

  const animateThisIcon = useCallback((Icon: ForwardedRefAnimatedIcon) => {
    actionButtonRef.current?.animateThisIcon(Icon);
  }, []);

  // Recalculate the recurrence of a tudu when it is updated
  useEffect(() => {
      if (!recurrentTuduToRecalculate) return;

      const tuduClone = recurrentTuduToRecalculate.clone();

      const updatedTudu = updateRecurrentTudu(tuduClone);

      saveTudu(updatedTudu);

      setRecurrentTuduToRecalculate(undefined);
  }, [recurrentTuduToRecalculate, setRecurrentTuduToRecalculate]);


  // Filters all tudus with recurrence and last date past today to update their date
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const recurrentTudusToUpdate = getAllRecurrentTudusToUpdate();
    const updatedTudus = recurrentTudusToUpdate.map(updateRecurrentTudu);

    if (updatedTudus.length === 0) return;

    saveAllTudus(updatedTudus);
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

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleNavigateToBackupSettings = useCallback(() => {
    navigation.navigate('BackupSettings');
  }, [navigation]);

  const countersList = useMemo(() => getAllCounters(), [getAllCounters]);

  return (
    <Page>
      <SpotlightTarget name="home_header" shape="rect" borderRadius={16} padding={6}>
        <HomeHeader
          onSearchPress={handleSearchPress}
          onSettingsPress={handleSettingsPress}
        />
      </SpotlightTarget>
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
              <SpotlightTarget name="home_smart_lists" shape="rect" borderRadius={18} padding={6}>
                <SmartLists
                  lists={smartLists}
                  onListPress={handleDefaultListPress}
                />
              </SpotlightTarget>
              <BackupReminderBanner onNavigateToBackupSettings={handleNavigateToBackupSettings} />
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
              <SpotlightTarget name="home_custom_lists" shape="rect" borderRadius={18} padding={6}>
                <SectionTitle title={t('sectionTitles.myLists')} />
                <CustomLists
                  onListPress={handleListPress}
                  animateIcon={animateThisIcon}
                />
              </SpotlightTarget>

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
          <SpotlightTarget name="home_action_button" shape="circle" padding={6}>
            <HomeActionButton ref={actionButtonRef} />
          </SpotlightTarget>
        </DraggableContextProvider>
      </DraxProvider>
    </Page>
  );
};

const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <SpotlightTourProvider>
      <HomePageContent {...props} />
    </SpotlightTourProvider>
  );
};

export { HomePage };

