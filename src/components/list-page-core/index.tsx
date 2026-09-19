import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Page } from '../../components/page';
import { DraggablePageContent } from '../../components/draggable-page-content';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { CheersAnimation } from '../../components/animated-components/cheers';
import {
  AnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../../components/animated-icons/animated-icon/types';
import { Dimensions } from 'react-native';
import { FloatingActionButtonRef } from '../../components/floating-action-button/types';
import { CheckMarkIconActionAnimation } from '../../components/animated-icons/check-mark';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { useListService } from '../../service/list-service-hook/useListService';
import {
  CheersAnimationContainer,
  FloatingAIButton,
  FloatingAIButtonContainer,
  styles,
} from './styles';
import { AIIcon } from '../animated-icons/ai-icon';
import { NewTuduModal } from '../new-tudu-modal';
import { ListActionButton } from '../list-action-button';
import { TudusList } from '../tudus-list';
import { ListPageCoreProps } from './types';
import { ListViewModel, TuduViewModel, RecurrenceType, cloneList } from '../../scenes/home/types';
import { ListHeader } from '../list-header';
import { TuduAdditionalInformation } from '../tudu-card/types';
import {
  formatToLocaleTime,
  formatScheduledDateTime,
  isToday,
  isOutdated,
} from '../../utils/date-utils';
import { UNLISTED_LIST_ID } from '../../scenes/home/state';
import { SkeletonTuduList } from '../skeleton-tudu-list';
import { showItemDeletedToast } from '../../utils/toast-utils';
import { useTranslation } from 'react-i18next';
import { UNLOADED_ID } from '../../constants';
import { trimEmoji } from '../../utils/emoji-utils';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useRecoilValue } from 'recoil';
import { toastSpan } from '../../state/atoms';

import { ScheduleModal } from '../schedule-modal';
import { AISuggestionsModal } from '../ai-suggestions-modal';
import { generateRandomHash } from '../../hooks/useHashGenerator';
import { ListOptionsButton } from '../list-options-button';
import { exportAndShareListFile, shareListAsText } from '../../service/list-sharing';
import Toast from 'react-native-toast-message';
import { openGoogleCalendarEvent } from '../../utils/google-calendar-utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigatorParamList } from '../../navigation/stack-navigator/types';
import { useAISettings } from '../../service/ai';
import { SectionModal } from '../section-modal';
import { ReorderPromptModal } from '../reorder-prompt-modal';
import { ReorderApplyPayload } from '../reorder-prompt-modal/types';
import { Section } from '../../scenes/home/types';

const ListPageCore: React.FC<ListPageCoreProps> = memo(
  ({
    setTudus,
    handleBackButtonPress,
    onUpdateList,
    list,
    Icon,
    numberOfUndoneTudus,
    isSmartList = false,
    allowAdding = true,
    TopComponent,
    defaultDueDate,
    defaultListId,
    defaultOrigin,
  }) => {
    const toastBottomSpan = useRecoilValue(toastSpan);
    const actionButtonRef = useRef<FloatingActionButtonRef>(null);

    const { settings } = useAISettings();
    const navigation =
      useNavigation<NativeStackNavigationProp<StackNavigatorParamList>>();
    const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
    const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
    const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
    const [aiSuggestionsModalVisible, setAiSuggestionsModalVisible] = useState(false);
    const [sectionModalVisible, setSectionModalVisible] = useState(false);
    const [reorderPromptModalVisible, setReorderPromptModalVisible] = useState(false);
    const aiIconRef = useRef<AnimatedIconRef>(null);

    const handleOpenAISettings = useCallback(() => {
      navigation.navigate('AISettings');
    }, [navigation]);

    const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();

    const { saveTudu, deleteTudu, deleteTudus, undoTudus, restoreBackup, saveListAndTudus } = useListService();

    const { t } = useTranslation();

    const loading = useMemo(
      () => list?.id === UNLOADED_ID,
      [list?.id],
    );

    const tudus = useMemo(() => {
      return !list?.tudus ? [] : [...list.tudus];
    }, [list?.tudus]);

    const handleSetTudus: typeof setTudus = useCallback(
      tudusList => {
        if (list) {
          const newList = cloneList(list);
          newList.tudus = tudusList;
          if (!isSmartList) {
            saveListAndTudus(newList);
          }
          onUpdateList?.(newList);
        }
        setTudus(tudusList);
      },
      [list, isSmartList, saveListAndTudus, onUpdateList, setTudus],
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
        if (!list) {
          return;
        }

        tudu.done = !tudu.done;

        if (onUpdateList) {
          const newList = cloneList(list);
          newList.tudus =
            list.tudus?.map(x => {
              if (x.id === tudu.id) {
                return tudu;
              }
              return x;
            }) || [];
          onUpdateList(newList);
        }

        saveTudu(tudu);

        const allDone =
          !!list.tudus?.filter(x => x.id !== tudu.id).every(x => x.done) &&
          tudu.done;

        if (allDone) {
          setTimeout(() => {
            handleListCompleted();
            handleEmojiAnimation(tudu.label);
          }, 600);
        } else if (tudu.done) {
          handleEmojiAnimation(tudu.label);
        }
      },
      [handleListCompleted, list, onUpdateList, saveTudu, handleEmojiAnimation],
    );

    const handleTuduStarPress = useCallback(
      (tudu: TuduViewModel) => {
        if (!list) {
          return;
        }

        tudu.starred = !tudu.starred;

        if (onUpdateList) {
          const newList = cloneList(list);
          newList.tudus =
            list.tudus?.map(x => {
              if (x.id === tudu.id) {
                return tudu;
              }
              return x;
            }) || [];
          onUpdateList(newList);
        }

        saveTudu(tudu);
      },
      [list, onUpdateList, saveTudu],
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
              label: formatScheduledDateTime(tudu.dueDate!, tudu.hasTime, t),
              originType: 'scheduled',
            };
          }
          if (tudu.hasTime && tudu.dueDate) {
            return {
              label: `${tudu.listName} • ${formatToLocaleTime(tudu.dueDate)}`,
              originType: 'list',
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
            label: formatScheduledDateTime(tudu.dueDate, tudu.hasTime, t),
            originType: isScheduledForToday ? 'today' : 'scheduled',
          };
        }
      },
      [isSmartList, t],
    );

    const handleInsertOrUpdate = useCallback(
      (tudu: TuduViewModel) => {
        console.log(`📋 [ListPageCore] handleInsertOrUpdate:`, {
          tuduId: tudu.id,
          label: tudu.label,
          listId: tudu.listId,
          origin: tudu.origin,
          dueDate: tudu.dueDate?.toString(),
          hasTime: tudu.hasTime,
          isEditing: !!editingTudu,
        });
        if (editingTudu) {
          const tuduIndex = tudus.findIndex(
            x => x.id === tudu.id,
          );
          if (tuduIndex >= 0) {
            const newList = [...tudus];
            newList[tuduIndex] = tudu;
            handleSetTudus(newList);
          } else {
            handleSetTudus([tudu, ...tudus]);
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
        const remainingTudus = tudus.filter(t => t.id !== tudu.id);
        handleSetTudus(remainingTudus);
        showItemDeletedToast(t('toast.tuduDeleted'), restoreBackup);
      },
      [deleteTudu, handleSetTudus, restoreBackup, t, tudus],
    );

    const handleClearAllDone = useCallback(
      (doneTudus: TuduViewModel[]) => {
        if (!doneTudus || !doneTudus.length) return;
        deleteTudus(doneTudus);
        const doneIds = new Set(doneTudus.map(t => t.id));
        const remainingTudus = tudus.filter(t => !doneIds.has(t.id));
        handleSetTudus(remainingTudus);
        showItemDeletedToast(t('toast.allDoneDeleted'), restoreBackup);
      },
      [deleteTudus, handleSetTudus, restoreBackup, t, tudus],
    );

    const handleUndoAllPress = useCallback(
      (doneTudus: TuduViewModel[]) => {
        if (!doneTudus || !doneTudus.length) return;
        undoTudus(doneTudus);
        const doneIds = new Set(doneTudus.map(t => t.id));
        const updatedTudus = tudus.map(t => {
          if (doneIds.has(t.id)) {
            const clone = t.clone();
            clone.done = false;
            return clone;
          }
          return t;
        });
        handleSetTudus(updatedTudus);
      },
      [handleSetTudus, tudus, undoTudus],
    );

    const handleInsertTudu = useCallback(() => {
      setNewTuduPopupVisible(true);
    }, []);

    const handleEditPress = useCallback((tudu: TuduViewModel) => {
      setEditingTudu(tudu);
      setNewTuduPopupVisible(true);
    }, []);

    const handleTuduSchedulePress = useCallback((tudu: TuduViewModel) => {
      setEditingTudu(tudu);
      setScheduleModalVisible(true);
    }, []);

    const handleSchedule = useCallback(
      (
        date: Date,
        hasTime?: boolean,
        recurrence?: RecurrenceType,
        addToGoogleCalendar?: boolean,
      ) => {
        console.log(`📋 [ListPageCore] handleSchedule:`, {
          editingTuduId: editingTudu?.id,
          editingTuduLabel: editingTudu?.label,
          editingTuduListId: editingTudu?.listId,
          editingTuduOrigin: editingTudu?.origin,
          date: date.toString(),
          hasTime,
          recurrence,
        });
        if (editingTudu) {
          editingTudu.dueDate = date;
          editingTudu.hasTime = hasTime;
          editingTudu.recurrence = recurrence;
          if (!editingTudu.listId || editingTudu.listId === 'scheduled') {
            editingTudu.listId = defaultListId || UNLISTED_LIST_ID;
            editingTudu.origin = defaultOrigin || 'unlisted';
          }
          handleInsertOrUpdate(editingTudu);
          saveTudu(editingTudu);

          if (addToGoogleCalendar && date) {
            openGoogleCalendarEvent({
              title: editingTudu.label,
              date,
              hasTime,
              recurrence,
              listName: editingTudu.listName || list?.label,
            });
          }
        }
      },
      [editingTudu, handleInsertOrUpdate, list?.label, saveTudu, defaultListId, defaultOrigin],
    );

    const existingTasks = useMemo(() => {
      return tudus.map(t => t.label);
    }, [tudus]);

    const handleBatchInsertTudus = useCallback(
      (taskLabels: string[]) => {
        if (!taskLabels.length) return;
        const newTudus = taskLabels.map(label => {
          const listIdToUse = defaultListId || (list?.id === 'scheduled' || isSmartList ? UNLISTED_LIST_ID : (list?.id || ''));
          const originToUse = defaultOrigin || (list?.id === 'scheduled' || isSmartList ? 'unlisted' : (list?.origin || 'default'));
          const tudu = new TuduViewModel(
            {
              label,
              done: false,
              id: generateRandomHash('Tudu'),
              dueDate: defaultDueDate,
            },
            listIdToUse,
            originToUse,
          );
          return tudu;
        });

        const updatedList = [...newTudus, ...tudus];
        handleSetTudus(updatedList);
        RNReactNativeHapticFeedback.trigger('notificationSuccess');
      },
      [defaultDueDate, defaultListId, defaultOrigin, handleSetTudus, list, isSmartList, tudus],
    );

    const handleAISuggestionsPress = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('impactLight');
      aiIconRef.current?.play();
      setAiSuggestionsModalVisible(true);
    }, []);

    const handleCloseAISuggestionsModal = useCallback(() => {
      setAiSuggestionsModalVisible(false);
    }, []);

    const handleShareFile = useCallback(async () => {
      if (!list) return;
      try {
        await exportAndShareListFile(list, tudus);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: t('messages.shareErrorTitle', { defaultValue: 'Erro ao compartilhar' }),
          text2: error.message || t('messages.shareErrorMsg', { defaultValue: 'Não foi possível gerar o arquivo da lista.' }),
        });
      }
    }, [list, tudus, t]);

    const handleShareText = useCallback(async () => {
      if (!list) return;
      try {
        await shareListAsText(list, tudus);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: t('messages.shareErrorTitle', { defaultValue: 'Erro ao compartilhar' }),
          text2: error.message || t('messages.shareErrorMsg', { defaultValue: 'Não foi possível gerar o texto da lista.' }),
        });
      }
    }, [list, tudus, t]);

    const handleInvertOrder = useCallback(() => {
      if (!list || !tudus.length) return;

      const undoneTudus = tudus.filter(x => !x.done);
      if (undoneTudus.length <= 1) {
        RNReactNativeHapticFeedback.trigger('impactLight');
        return;
      }

      const reversedUndone = [...undoneTudus].reverse();
      const doneTudus = tudus.filter(x => x.done);
      const newTudus = [...reversedUndone, ...doneTudus];

      handleSetTudus(newTudus);
      RNReactNativeHapticFeedback.trigger('impactLight');
    }, [list, tudus, handleSetTudus]);

    const handleUpdateList = useCallback(
      (updatedList: ListViewModel) => {
        if (!isSmartList) {
          saveListAndTudus(updatedList);
        }
        onUpdateList?.(updatedList);
      },
      [saveListAndTudus, onUpdateList, isSmartList],
    );

    const handleCreateSection = useCallback(
      (title: string) => {
        if (!list) return;
        const currentSections = list.sections ? [...list.sections] : [];
        const newSection: Section = {
          id: generateRandomHash('Section'),
          title,
          order: currentSections.length,
        };
        const newList = cloneList(list);
        newList.sections = [...currentSections, newSection];
        handleUpdateList(newList);
      },
      [list, handleUpdateList],
    );

    const handleOpenReorderPrompt = useCallback(() => {
      setReorderPromptModalVisible(true);
    }, []);

    const handleOpenAddSection = useCallback(() => {
      setSectionModalVisible(true);
    }, []);

    const handleApplyReorderedList = useCallback(
      async (payload: ReorderApplyPayload) => {
        if (!list || !list.tudus || list.tudus.length === 0) return;

        const currentTudus = list.tudus;
        const newSections: Section[] = [];
        const sectionTitleToId = new Map<string, string>();

        if (payload.sections && payload.sections.length > 0) {
          payload.sections.forEach((sec, idx) => {
            const secId = generateRandomHash('Section');
            sectionTitleToId.set(sec.title, secId);
            newSections.push({
              id: secId,
              title: sec.title,
              order: idx,
            });
          });
        }

        const usedTuduIds = new Set<string>();
        const reorderedTudus: TuduViewModel[] = [];

        payload.reorderedItems.forEach(item => {
          const secId = item.sectionTitle ? sectionTitleToId.get(item.sectionTitle) : undefined;
          const match =
            currentTudus.find(
              t =>
                !usedTuduIds.has(t.id) &&
                t.label.trim().toLowerCase() === item.label.trim().toLowerCase(),
            ) ||
            currentTudus.find(
              t =>
                !usedTuduIds.has(t.id) &&
                (t.label.toLowerCase().includes(item.label.toLowerCase()) ||
                  item.label.toLowerCase().includes(t.label.toLowerCase())),
            );

          if (match) {
            usedTuduIds.add(match.id);
            const cloned = match.clone();
            cloned.sectionId = secId;
            reorderedTudus.push(cloned);
          }
        });

        currentTudus.forEach(t => {
          if (!usedTuduIds.has(t.id)) {
            reorderedTudus.push(t.clone());
          }
        });

        const newList = cloneList(list);
        newList.sections = newSections.length > 0 ? newSections : undefined;
        newList.orderingPrompt = payload.orderingPrompt || undefined;
        newList.tudus = reorderedTudus;

        handleUpdateList(newList);

        RNReactNativeHapticFeedback.trigger('notificationSuccess');
        Toast.show({
          type: 'success',
          text1: t('reorderPromptModal.successToast', {
            defaultValue: 'Lista reordenada com sucesso!',
          }),
          position: 'bottom',
          bottomOffset: 60,
        });
      },
      [list, handleUpdateList, t],
    );

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
            <Animated.View style={{ flex: 1 }}>
              <TudusList
                onTuduPress={handleTuduPress}
                animateIcon={animateThisIcon}
                getAdditionalInformation={getAdditionalInformation}
                onStarPress={handleTuduStarPress}
                onEditPress={handleEditPress}
                onDeletePress={handleTuduDelete}
                onClearAllDonePress={handleClearAllDone}
                onSchedulePress={handleTuduSchedulePress}
                onUndoAllPress={handleUndoAllPress}
                list={list}
                setTudus={handleSetTudus}
                TopComponent={TopComponent}
                onInsertTuduPress={allowAdding ? handleInsertTudu : undefined}
                onAISuggestionsPress={handleAISuggestionsPress}
                isSmartList={isSmartList}
                onUpdateList={handleUpdateList}
              />
            </Animated.View>
          )}
          {!isSmartList && !loading && !!list?.label && list?.id !== UNLISTED_LIST_ID && (
            <ListOptionsButton
              onInvertOrderPress={handleInvertOrder}
              onShareTextPress={handleShareText}
              onShareFilePress={handleShareFile}
              onAddSectionPress={handleOpenAddSection}
              onReorderWithAIPress={
                list?.tudus && list.tudus.length > 0
                  ? handleOpenReorderPrompt
                  : undefined
              }
            />
          )}
          {allowAdding && !loading && (
            <>
              {!isSmartList && !!list?.label && (
                <FloatingAIButtonContainer
                  entering={FadeIn.delay(900).duration(300)}
                  extraBottomMargin={toastBottomSpan}
                  pointerEvents="box-none">
                  <FloatingAIButton
                    onPress={handleAISuggestionsPress}
                    scaleFactor={0.08}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <AIIcon ref={aiIconRef} size={60} animateWhenIdle={true} autoPlay />
                  </FloatingAIButton>
                </FloatingAIButtonContainer>
              )}

              <ListActionButton
                ref={actionButtonRef}
                onInsertTuduPress={handleInsertTudu}
              />
            </>
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
          onBatchInsert={handleBatchInsertTudus}
          editingTudu={editingTudu}
          listName={list?.label}
          existingTasks={existingTasks}
          defaultDueDate={defaultDueDate}
          defaultListId={defaultListId}
          defaultOrigin={defaultOrigin}
        />
        <ScheduleModal
          isVisible={scheduleModalVisible}
          onModalClose={() => {
            setScheduleModalVisible(false);
            setEditingTudu(undefined);
            setTimeout(closeCurrentlyOpenSwipeable, 500);
          }}
          onSchedule={handleSchedule}
          currentDate={editingTudu?.dueDate}
          hasTimeInitial={editingTudu?.hasTime}
          currentRecurrence={editingTudu?.recurrence}
          tuduTitle={editingTudu?.label}
          listName={editingTudu?.listName || list?.label}
        />
        <AISuggestionsModal
          isVisible={aiSuggestionsModalVisible}
          onClose={handleCloseAISuggestionsModal}
          listName={list?.label}
          existingTasks={existingTasks}
          onConfirm={handleBatchInsertTudus}
        />
        <SectionModal
          visible={sectionModalVisible}
          isEditing={false}
          onSave={handleCreateSection}
          onRequestClose={() => setSectionModalVisible(false)}
        />
        <ReorderPromptModal
          visible={reorderPromptModalVisible}
          listName={list?.label}
          initialPrompt={list?.orderingPrompt}
          currentItems={list?.tudus?.map(t => t.label) ?? []}
          currentSections={list?.sections?.map(s => s.title)}
          onApplyReorder={handleApplyReorderedList}
          onRequestClose={() => setReorderPromptModalVisible(false)}
          onOpenAISettings={handleOpenAISettings}
        />
      </Page>
    );
  },
);

ListPageCore.displayName = 'ListPageCore';

export { ListPageCore };

