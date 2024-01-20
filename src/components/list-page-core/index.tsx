import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {DraxProvider} from 'react-native-drax';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
import {DraggableContextProvider} from '../../modules/draggable/draggable-context';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {CheersAnimation} from '../../components/animated-components/cheers';
import {
  AnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../../components/animated-icons/animated-icon/types';
import {Dimensions} from 'react-native';
import {FloatingActionButtonRef} from '../../components/floating-action-button/types';
import {CheckMarkIconActionAnimation} from '../../components/animated-icons/check-mark';
import {useCloseCurrentlyOpenSwipeable} from '../../hooks/useCloseAllSwipeables';
import {useListService} from '../../service/list-service-hook/useListService';
import {CheersAnimationContainer, styles} from './styles';
import {NewTuduModal} from '../new-tudu-modal';
import {ListActionButton} from '../list-action-button';
import {TudusList} from '../tudus-list';
import {ListPageCoreProps} from './types';
import {TuduViewModel} from '../../scenes/home/types';
import {ListHeader} from '../list-header';
import {TuduAdditionalInformation} from '../tudu-card/types';
import {formatToLocaleDate, isToday} from '../../utils/date-utils';
import {UNLISTED} from '../../scenes/home/state';
import {SkeletonTuduList} from '../skeleton-tudu-list';
import {showItemDeletedToast} from '../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {UNLOADED_ID} from '../../constants';

const ListPageCore: React.FC<ListPageCoreProps> = memo(
  ({
    setTudus,
    handleBackButtonPress,
    list,
    Icon,
    numberOfUndoneTudus,
    showScheduleInformation = true,
    isSmartList = false,
    draggableEnabled = true,
    allowAdding = true,
  }) => {
    const actionButtonRef = useRef<FloatingActionButtonRef>(null);
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();

    const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();

    const {saveTudu, deleteTudu, restoreBackup} = useListService();

    const {t} = useTranslation();

    const [internalList, setInternalList] = useState(list);

    const loading = useMemo(
      () => internalList?.id === UNLOADED_ID,
      [internalList?.id],
    );

    const draggableTudus = useMemo(() => {
      if (!internalList?.tudus) {
        return [];
      }
      return (
        [...internalList.tudus].map(
          (tudu, index) => new DraggableItem([tudu], undefined, index),
        ) ?? []
      );
    }, [internalList]);

    useEffect(() => {
      setInternalList(list);
    }, [list]);

    const handleSetTudus: typeof setTudus = useCallback(
      draggableList => {
        const tudusList = draggableList.map(x => x.data[0]);
        setInternalList(current => {
          if (!current) {
            return undefined;
          }
          return {...current, tudus: tudusList};
        });
        setTudus(draggableList);
      },
      [setTudus],
    );

    const handleListDragStart = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('soft');
    }, []);

    const handleListCompleted = useCallback(() => {
      cheersRef.current?.play();
      RNReactNativeHapticFeedback.trigger('notificationSuccess');
      actionButtonRef.current?.animateThisIcon(CheckMarkIconActionAnimation);
    }, []);

    const handleTuduPress = useCallback(
      (tudu: TuduViewModel) => {
        if (!internalList) {
          return;
        }

        tudu.done = !tudu.done;

        saveTudu(tudu);

        const allDone =
          !!internalList.tudus
            ?.filter(x => x.id !== tudu.id)
            .every(x => x.done) && tudu.done;
        if (allDone) {
          handleListCompleted();
        }
      },
      [handleListCompleted, internalList, saveTudu],
    );

    const handleTuduStarPress = useCallback(
      (tudu: TuduViewModel) => {
        if (!internalList) {
          return;
        }

        tudu.starred = !tudu.starred;

        saveTudu(tudu);
      },
      [internalList, saveTudu],
    );

    const animateThisIcon = useCallback(
      (thisIcon: ForwardedRefAnimatedIcon) => {
        actionButtonRef.current?.animateThisIcon(thisIcon);
      },
      [],
    );

    const cheersRef = useRef<AnimatedIconRef>(null);

    const getAdditionalInformation = useCallback(
      (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
        if (isSmartList && tudu.listName && tudu.listId !== UNLISTED) {
          return {
            label: tudu.listName,
            originType: 'list',
          };
        }
        if (showScheduleInformation && tudu.dueDate) {
          const isScheduledForToday = isToday(tudu.dueDate);
          return {
            label: isScheduledForToday
              ? 'Today'
              : formatToLocaleDate(tudu.dueDate),
            originType: isScheduledForToday ? 'today' : 'scheduled',
          };
        }
      },
      [isSmartList, showScheduleInformation],
    );

    const handleInsertOrUpdate = useCallback(
      (tudu: TuduViewModel) => {
        const draggableTudu = new DraggableItem([tudu]);
        if (editingTudu) {
          const tuduIndex = draggableTudus.findIndex(
            x => x.data[0].id === tudu.id,
          );
          if (tuduIndex >= 0) {
            const newList = [...draggableTudus];
            newList[tuduIndex] = draggableTudu;
            handleSetTudus(newList);
          }
        } else {
          const newList = draggableTudus.length
            ? [draggableTudu, ...draggableTudus]
            : [draggableTudu];
          handleSetTudus(newList);
        }
      },
      [draggableTudus, editingTudu, handleSetTudus],
    );

    const handleTuduDelete = useCallback(
      (tudu: TuduViewModel) => {
        deleteTudu(tudu);
        showItemDeletedToast(t('toast.tuduDeleted'), restoreBackup);
      },
      [deleteTudu, restoreBackup, t],
    );

    return (
      <Page>
        <ListHeader
          listData={list}
          onBackButtonPress={handleBackButtonPress}
          Icon={Icon}
        />
        <DraxProvider>
          <DraggableContextProvider<TuduViewModel>
            data={draggableTudus}
            onSetData={handleSetTudus}
            onDragStart={handleListDragStart}>
            <CheersAnimationContainer pointerEvents="none">
              <CheersAnimation
                ref={cheersRef}
                speed={2}
                style={{
                  width: Dimensions.get('screen').width,
                  height: Dimensions.get('screen').height,
                }}
              />
            </CheersAnimationContainer>

            <DraggablePageContent
              contentContainerStyle={styles.scrollContentContainer}>
              {loading ? (
                <SkeletonTuduList numberOfItems={numberOfUndoneTudus} />
              ) : (
                <TudusList
                  onTuduPress={handleTuduPress}
                  animateIcon={animateThisIcon}
                  getAdditionalInformation={getAdditionalInformation}
                  draggableEnabled={draggableEnabled}
                  onStarPress={handleTuduStarPress}
                  onEditPress={tudu => {
                    setEditingTudu(tudu);
                    setNewTuduPopupVisible(true);
                  }}
                  onDeletePress={handleTuduDelete}
                />
              )}
            </DraggablePageContent>
            <NewTuduModal
              visible={newTuduPopupVisible}
              onRequestClose={() => {
                setNewTuduPopupVisible(false);
                setEditingTudu(undefined);
                closeCurrentlyOpenSwipeable();
              }}
              onInsertOrUpdate={handleInsertOrUpdate}
              editingTudu={editingTudu}
            />
            {allowAdding && (
              <ListActionButton
                ref={actionButtonRef}
                onInsertTuduPress={() => setNewTuduPopupVisible(true)}
              />
            )}
          </DraggableContextProvider>
        </DraxProvider>
      </Page>
    );
  },
);

export {ListPageCore};
