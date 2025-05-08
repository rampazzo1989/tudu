import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Page} from '../../components/page';
import {DraggablePageContent} from '../../components/draggable-page-content';
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
import {ListViewModel, TuduViewModel} from '../../scenes/home/types';
import {ListHeader} from '../list-header';
import {TuduAdditionalInformation} from '../tudu-card/types';
import {formatToLocaleDate, isToday, isOutdated} from '../../utils/date-utils';
import {UNLISTED_LIST_ID} from '../../scenes/home/state';
import {SkeletonTuduList} from '../skeleton-tudu-list';
import {showItemDeletedToast} from '../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {UNLOADED_ID} from '../../constants';
import { trimEmoji } from '../../utils/emoji-utils';
import Animated, { LinearTransition } from 'react-native-reanimated';

const ListPageCore: React.FC<ListPageCoreProps> = memo(
  ({
    setTudus,
    handleBackButtonPress,
    list,
    Icon,
    numberOfUndoneTudus,
    isSmartList = false,
    allowAdding = true,
    TopComponent,
  }) => {
    const actionButtonRef = useRef<FloatingActionButtonRef>(null);
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();

    const {closeCurrentlyOpenSwipeable} = useCloseCurrentlyOpenSwipeable();
    const hookContent = useCloseCurrentlyOpenSwipeable();

    const {saveTudu, deleteTudu, deleteTudus, undoTudus, restoreBackup} = useListService();

    const {t} = useTranslation();

    const [internalList, setInternalList] = useState(list);

    const loading = useMemo(
      () => internalList?.id === UNLOADED_ID,
      [internalList?.id],
    );

    const tudus = useMemo(() => {
      return !internalList?.tudus ? [] : 
      [
        ...internalList.tudus
      ];
    }, [internalList]);

    useEffect(() => {
      setInternalList(list);
    }, [list]);

    const handleSetTudus: typeof setTudus = useCallback(
      tudusList => {
        setInternalList(current => {
          if (!current) {
            return undefined;
          }
          return {...current, tudus: tudusList};
        });
        setTudus(tudusList);
      },
      [setTudus],
    );

    const handleListCompleted = useCallback(() => {
      cheersRef.current?.play();
      RNReactNativeHapticFeedback.trigger('notificationSuccess');
    }, []);

    const handleEmojiAnimation = useCallback((text: string) => {
      var emojiInfo = trimEmoji(text);
      if (emojiInfo?.emoji) {
        actionButtonRef.current?.animateThisIcon(emojiInfo.emoji);
      } else {
        actionButtonRef.current?.animateThisIcon(CheckMarkIconActionAnimation);
      }
    }, []);

    const handleTuduPress = useCallback(
      (tudu: TuduViewModel) => {
        if (!internalList) {
          return;
        }

        tudu.done = !tudu.done;
        
        // First updates the internal list
        setInternalList(current => {
          if (!current) {
            return undefined;
          }
          return {
            ...current,
            tudus: current.tudus?.map(x => {
              if (x.id === tudu.id) {
                return tudu;
              }
              return x;
            }),
          } as ListViewModel;
        });

        // Then updates the global list
        setTimeout(() => saveTudu(tudu), 50);

        const allDone = !!internalList.tudus?.filter(x => x.id !== tudu.id).every(x => x.done) && tudu.done;

        if (allDone) {
          setTimeout(() => {
            handleListCompleted();
            handleEmojiAnimation(tudu.label);
          }, 600);
        } else if (tudu.done) {
          handleEmojiAnimation(tudu.label);
        }
      },
      [handleListCompleted, internalList, saveTudu, handleEmojiAnimation],
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
      (thisIcon: ForwardedRefAnimatedIcon | string) => {
        actionButtonRef.current?.animateThisIcon(thisIcon);
      },
      [],
    );

    const cheersRef = useRef<AnimatedIconRef>(null);

    const getAdditionalInformation = useCallback(
      (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
        // Rules for smart lists
        if (isSmartList && tudu.listName && tudu.listId !== UNLISTED_LIST_ID) {
          // Outdated tudús
          const outdated = tudu.dueDate && isOutdated(tudu.dueDate);
          if (outdated) {
            return {
              label: formatToLocaleDate(tudu.dueDate!),
              originType: 'scheduled',
            };
          }
          return {
            label: tudu.listName,
            originType: 'list',
          };
        }
        // Rules for custom lists
        if (tudu.dueDate) {
          const isScheduledForToday = isToday(tudu.dueDate);
          return {
            label: isScheduledForToday
              ? t('labels.today')
              : formatToLocaleDate(tudu.dueDate),
            originType: isScheduledForToday ? 'today' : 'scheduled',
          };
        }
      },
      [isSmartList],
    );

    const handleInsertOrUpdate = useCallback(
      (tudu: TuduViewModel) => {
        if (editingTudu) {
          const tuduIndex = tudus.findIndex(
            x => x.id === tudu.id,
          );
          if (tuduIndex >= 0) {
            const newList = [...tudus];
            newList[tuduIndex] = tudu;
            handleSetTudus(newList);
          }
        } else {
          const newList = tudus.length
            ? [tudu, ...tudus]
            : [tudu];
          handleSetTudus(newList);
        }
      },
      [tudus, editingTudu, handleSetTudus],
    );

    const handleTuduDelete = useCallback(
      (tudu: TuduViewModel) => {
        deleteTudu(tudu);
        showItemDeletedToast(t('toast.tuduDeleted'), restoreBackup);
      },
      [deleteTudu, restoreBackup, t],
    );

    const handleClearAllDone = useCallback(
      (doneTudus: TuduViewModel[]) => {
        deleteTudus(doneTudus);
        showItemDeletedToast(t('toast.allDoneDeleted'), restoreBackup);
      },
      [deleteTudus, restoreBackup, t],
    );

    const handleUndoAllPress = useCallback((doneTudus: TuduViewModel[]) => {
      undoTudus(doneTudus);
    }, [undoTudus]);

    const handleInsertTudu = useCallback(() => {
      setNewTuduPopupVisible(true);
    }, []);

    const handleEditPress = useCallback((tudu: TuduViewModel) => {
      setEditingTudu(tudu);
      setNewTuduPopupVisible(true);
    }, []);

    return (
      <Page>
        <ListHeader
          listData={list}
          onBackButtonPress={handleBackButtonPress}
          Icon={Icon}
        />
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
          style={styles.scrollContentContainer}>
          {loading ? (
            <SkeletonTuduList numberOfItems={numberOfUndoneTudus} />
          ) : (
            <Animated.View style={{flex: 1}} layout={LinearTransition}>
              <TudusList
                onTuduPress={handleTuduPress}
                animateIcon={animateThisIcon}
                getAdditionalInformation={getAdditionalInformation}
                onStarPress={handleTuduStarPress}
                onEditPress={handleEditPress}
                onDeletePress={handleTuduDelete}
                onClearAllDonePress={handleClearAllDone}
                onUndoAllPress={handleUndoAllPress}
                list={internalList}
                setTudus={handleSetTudus}
                TopComponent={TopComponent}
              />
            </Animated.View>
          )}
          {allowAdding && !loading && (
          <ListActionButton
            ref={actionButtonRef}
            onInsertTuduPress={handleInsertTudu}
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
          listName={list?.label}
        />
      </Page>
    );
  },
);

export {ListPageCore};
