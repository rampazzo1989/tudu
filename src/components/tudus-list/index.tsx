import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import {
  Container,
  OptionsIconContainer,
  OptionsTouchable,
  SectionTitle,
  TuduAnimatedWrapper,
} from './styles';
import { TudusListProps } from './types';
import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { CheckMarkIcon } from '../animated-icons/check-mark';
import { TuduCard } from '../tudu-card';
import { Section, TuduViewModel } from '../../scenes/home/types';
import { SwipeableCardRef } from '../swipeable-card/types';
import { isToday } from '../../utils/date-utils';
import { DeleteIconActionAnimation } from '../animated-icons/delete-icon';
import { PopoverMenu } from '../popover-menu';
import { DoneItemsOptions } from './done-items-options';
import { OptionsThreeDotsIcon } from '../animated-icons/options-arrow-down-icon';
import { BaseAnimatedIconRef } from '../animated-icons/animated-icon/types';
import { RefreshIcon } from '../animated-icons/refresh-icon';
import {
  DragEndParams,
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
  ShadowDecorator,
} from 'react-native-draggable-flatlist';
import { useListService } from '../../service/list-service-hook/useListService';
import { SwipeableTuduCard } from '../tudu-card/swipeable-tudu-card';
import { ShrinkableView } from '../shrinkable-view';
import { useTranslation } from 'react-i18next';
import { SendToTodayModal } from '../send-to-today-modal';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { EmptyTudusState } from '../empty-tudus-state';
import { SectionHeader } from './section-header';
import { EmptySectionDropzone } from './empty-section-dropzone';
import { SectionModal } from '../section-modal';
import { SectionDeleteModal } from '../section-delete-modal';

export type TudusListRow =
  | {
      type: 'tudu';
      id: string;
      tudu: TuduViewModel;
      sectionId?: string;
    }
  | {
      type: 'section_header';
      id: string;
      section: Section;
      itemCount: number;
      isFirst: boolean;
      isLast: boolean;
    }
  | {
      type: 'empty_section_dropzone';
      id: string;
      section: Section;
    };

const TudusList: React.FC<TudusListProps> = memo(
  ({
    onTuduPress,
    onEditPress,
    onDeletePress,
    onClearAllDonePress,
    onUndoAllPress,
    onStarPress,
    onSchedulePress,
    setTudus,
    getAdditionalInformation,
    animateIcon,
    list,
    TopComponent,
    onInsertTuduPress,
    onAISuggestionsPress,
    isSmartList,
    onUpdateList,
  }) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const [allDoneReactionVisible, setAllDoneReactionVisible] = useState(false);
    const [dragVersion, setDragVersion] = useState(0);
    const [tuduWaitingForConfirmation, setTuduWaitingForConfirmation] =
      useState<TuduViewModel | null>(null);

    // Section modal states
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [deletingSection, setDeletingSection] = useState<Section | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();
    const { t } = useTranslation();
    const { saveTudu } = useListService();

    const handleOptionsButtonPress = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(true);
    }, []);

    const handlePopoverMenuRequestClose = useCallback(() => {
      iconRef.current?.toggle();
      setPopoverMenuVisible(false);
    }, []);

    const tuduList = useMemo(() => {
      return list ? list.tudus : [];
    }, [list]);

    const sections = useMemo(() => {
      return (list?.sections ? [...list.sections] : []).sort(
        (a, b) => a.order - b.order,
      );
    }, [list?.sections]);

    const hasSections = sections.length > 0;

    const undoneTudus = useMemo(() => {
      return tuduList.filter(x => !x.done);
    }, [tuduList]);

    const doneTudus = useMemo(() => {
      return tuduList.filter(x => x.done);
    }, [tuduList]);

    const handleClearAllDonePress = useCallback(() => {
      onClearAllDonePress(doneTudus);
      animateIcon?.(DeleteIconActionAnimation);
    }, [doneTudus, onClearAllDonePress, animateIcon]);

    const handleUndoAllPress = useCallback(() => {
      onUndoAllPress(doneTudus);
      animateIcon?.(RefreshIcon);
    }, [doneTudus, onUndoAllPress, animateIcon]);

    const OptionsComponent = useCallback(
      () => (
        <OptionsTouchable
          onPress={handleOptionsButtonPress}
          hitSlop={20}
          scaleFactor={0}>
          <OptionsIconContainer>
            <OptionsThreeDotsIcon ref={iconRef} speed={2} />
          </OptionsIconContainer>
        </OptionsTouchable>
      ),
      [handleOptionsButtonPress],
    );

    const OptionsMenu = useMemo(
      () => (
        <PopoverMenu
          isVisible={popoverMenuVisible}
          onRequestClose={handlePopoverMenuRequestClose}
          from={OptionsComponent}>
          <DoneItemsOptions
            closeMenu={handlePopoverMenuRequestClose}
            onClearAllDone={handleClearAllDonePress}
            onUndoAll={handleUndoAllPress}
          />
        </PopoverMenu>
      ),
      [
        popoverMenuVisible,
        handlePopoverMenuRequestClose,
        OptionsComponent,
        handleClearAllDonePress,
        handleUndoAllPress,
      ],
    );

    const CheckMarkAnimation = useMemo(() => {
      return (
        <CheckMarkIcon
          onAnimationFinish={() =>
            setTimeout(() => setAllDoneReactionVisible(false), 1500)
          }
          autoPlay
          speed={3}
        />
      );
    }, []);

    useEffect(() => {
      setAllDoneReactionVisible(undoneTudus.length === 0);
    }, [undoneTudus.length]);

    const getSectionTitle = useCallback(
      (doneLength: number) => {
        return (
          <Animated.View
            layout={LinearTransition}
            entering={FadeInUp}
            exiting={FadeOutUp}>
            <SectionTitle
              title={
                undoneTudus.length
                  ? t('sectionTitles.done')
                  : t('sectionTitles.allDone')
              }
              key="allTudus"
              marginTop={0}
              ControlComponent={
                allDoneReactionVisible ? undefined : OptionsMenu
              }
              ReactionComponent={
                allDoneReactionVisible ? CheckMarkAnimation : undefined
              }
            />
          </Animated.View>
        );
      },
      [
        undoneTudus.length,
        t,
        allDoneReactionVisible,
        OptionsMenu,
        CheckMarkAnimation,
      ],
    );

    const handleDeleteGenerator = useCallback(
      (deletingItem: TuduViewModel) => () => {
        onDeletePress(deletingItem);
        animateIcon?.(DeleteIconActionAnimation);
      },
      [animateIcon, onDeletePress],
    );

    const handleEditGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );

    const handleScheduleGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onSchedulePress(editingItem);
        },
      [onSchedulePress],
    );

    const sendToToday = useCallback(
      (editingItem: TuduViewModel) => {
        editingItem.dueDate = new Date();
        saveTudu(editingItem);
      },
      [saveTudu],
    );

    const removeFromToday = useCallback(
      (editingItem: TuduViewModel) => {
        editingItem.dueDate = undefined;
        saveTudu(editingItem);
      },
      [saveTudu],
    );

    const handleSendToOrRemoveFromTodayGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const dueDate = editingItem.dueDate;
          if (dueDate && isToday(dueDate)) {
            setTimeout(() => {
              removeFromToday(editingItem);
              swipeableRef.current?.closeOptions();
            }, 700);
          } else {
            if (editingItem.recurrence) {
              setTuduWaitingForConfirmation(editingItem);
              return;
            }
            setTimeout(() => {
              sendToToday(editingItem);
              swipeableRef.current?.closeOptions();
            }, 700);
          }
        },
      [removeFromToday, saveTudu, sendToToday],
    );

    // Section CRUD Actions
    const handleOpenRenameSection = useCallback((sec: Section) => {
      setEditingSection(sec);
      setRenameModalVisible(true);
    }, []);

    const handleSaveRenameSection = useCallback(
      (newTitle: string) => {
        if (!editingSection || !list) return;
        const updatedSections = (list.sections || []).map(s =>
          s.id === editingSection.id ? { ...s, title: newTitle } : s,
        );
        const newList = list.clone();
        newList.sections = updatedSections;
        onUpdateList?.(newList);
        setEditingSection(null);
      },
      [editingSection, list, onUpdateList],
    );

    const handleOpenDeleteSection = useCallback((sec: Section) => {
      setDeletingSection(sec);
      setDeleteModalVisible(true);
    }, []);

    const handleConfirmDeleteSection = useCallback(
      (deleteItems: boolean) => {
        if (!deletingSection || !list) return;
        const updatedSections = (list.sections || []).filter(
          s => s.id !== deletingSection.id,
        );

        let updatedTudus: TuduViewModel[] = [];
        if (deleteItems) {
          updatedTudus = (list.tudus || []).filter(
            t => t.sectionId !== deletingSection.id,
          );
        } else {
          updatedTudus = (list.tudus || []).map(t => {
            if (t.sectionId === deletingSection.id) {
              const cl = t.clone();
              cl.sectionId = undefined;
              return cl;
            }
            return t;
          });
        }

        const newList = list.clone();
        newList.sections = updatedSections;
        newList.tudus = updatedTudus;
        onUpdateList?.(newList);
        setDeletingSection(null);
      },
      [deletingSection, list, onUpdateList],
    );

    const handleMoveSectionUp = useCallback(
      (sec: Section) => {
        if (!list?.sections) return;
        const currentSections = [...list.sections].sort(
          (a, b) => a.order - b.order,
        );
        const idx = currentSections.findIndex(s => s.id === sec.id);
        if (idx <= 0) return;

        const temp = currentSections[idx - 1];
        currentSections[idx - 1] = currentSections[idx];
        currentSections[idx] = temp;

        const updatedSections = currentSections.map((s, i) => ({
          ...s,
          order: i,
        }));
        const newList = list.clone();
        newList.sections = updatedSections;
        onUpdateList?.(newList);
      },
      [list, onUpdateList],
    );

    const handleMoveSectionDown = useCallback(
      (sec: Section) => {
        if (!list?.sections) return;
        const currentSections = [...list.sections].sort(
          (a, b) => a.order - b.order,
        );
        const idx = currentSections.findIndex(s => s.id === sec.id);
        if (idx < 0 || idx >= currentSections.length - 1) return;

        const temp = currentSections[idx + 1];
        currentSections[idx + 1] = currentSections[idx];
        currentSections[idx] = temp;

        const updatedSections = currentSections.map((s, i) => ({
          ...s,
          order: i,
        }));
        const newList = list.clone();
        newList.sections = updatedSections;
        onUpdateList?.(newList);
      },
      [list, onUpdateList],
    );

    // Build Unified Flattened Rows
    const flatRows = useMemo<TudusListRow[]>(() => {
      if (!hasSections) {
        return undoneTudus.map(tudu => ({
          type: 'tudu',
          id: `tudu-${tudu.id}`,
          tudu,
        }));
      }

      const rows: TudusListRow[] = [];
      const sectionIds = new Set(sections.map(s => s.id));

      // 1. Unsectioned items
      const unsectionedTudus = undoneTudus.filter(
        t => !t.sectionId || !sectionIds.has(t.sectionId),
      );
      unsectionedTudus.forEach(tudu => {
        rows.push({
          type: 'tudu',
          id: `tudu-${tudu.id}`,
          tudu,
        });
      });

      // 2. Sections
      sections.forEach((sec, sIdx) => {
        const secTudus = undoneTudus.filter(t => t.sectionId === sec.id);

        rows.push({
          type: 'section_header',
          id: `section-${sec.id}`,
          section: sec,
          itemCount: secTudus.length,
          isFirst: sIdx === 0,
          isLast: sIdx === sections.length - 1,
        });

        if (secTudus.length === 0) {
          rows.push({
            type: 'empty_section_dropzone',
            id: `empty-${sec.id}`,
            section: sec,
          });
        } else {
          secTudus.forEach(tudu => {
            rows.push({
              type: 'tudu',
              id: `tudu-${tudu.id}`,
              tudu,
              sectionId: sec.id,
            });
          });
        }
      });

      return rows;
    }, [hasSections, sections, undoneTudus]);

    const SwipeableTudu: React.FC<{ tudu: TuduViewModel; isActive: boolean }> =
      useCallback(
        ({ tudu, isActive }) => {
          return (
            <SwipeableTuduCard
              enabled={!isActive}
              done={tudu.done}
              onDelete={handleDeleteGenerator(tudu)}
              onEdit={handleEditGenerator(tudu)}
              onSchedule={handleScheduleGenerator(tudu)}
              isOnToday={Boolean(tudu.dueDate && isToday(tudu.dueDate))}
              onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                tudu,
              )}
              allowSchedule={tudu.origin !== 'archived'}>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onStarPress={onStarPress}
                additionalInfo={getAdditionalInformation(tudu)}
              />
            </SwipeableTuduCard>
          );
        },
        [
          getAdditionalInformation,
          handleDeleteGenerator,
          handleEditGenerator,
          handleScheduleGenerator,
          handleSendToOrRemoveFromTodayGenerator,
          onStarPress,
          onTuduPress,
        ],
      );

    const renderUndoneRow = useCallback(
      ({ item: row, drag, isActive }: RenderItemParams<TudusListRow>) => {
        if (row.type === 'section_header') {
          return (
            <SectionHeader
              section={row.section}
              itemCount={row.itemCount}
              onRename={handleOpenRenameSection}
              onDelete={handleOpenDeleteSection}
              onMoveUp={handleMoveSectionUp}
              onMoveDown={handleMoveSectionDown}
              isFirst={row.isFirst}
              isLast={row.isLast}
            />
          );
        }

        if (row.type === 'empty_section_dropzone') {
          return (
            <EmptySectionDropzone
              section={row.section}
              onPress={() => onInsertTuduPress?.()}
            />
          );
        }

        const tudu = row.tudu;

        return (
          <ShadowDecorator elevation={5} color="black" opacity={1} radius={2}>
            <ScaleDecorator activeScale={1.05}>
              <ShrinkableView
                onPress={() => onTuduPress(tudu)}
                scaleFactor={0.03}
                style={{
                  height: 'auto',
                  width: '100%',
                  zIndex: 9999,
                  marginBottom: 8,
                }}
                onLongPress={drag}
                disabled={isActive}>
                {SwipeableTudu({ tudu, isActive })}
              </ShrinkableView>
            </ScaleDecorator>
          </ShadowDecorator>
        );
      },
      [
        handleOpenRenameSection,
        handleOpenDeleteSection,
        handleMoveSectionUp,
        handleMoveSectionDown,
        onInsertTuduPress,
        onTuduPress,
        SwipeableTudu,
      ],
    );

    const renderDoneItem = useCallback(
      ({ item: tudu }: LegendListRenderItemProps<TuduViewModel>) => {
        if (!tudu.done) return null;

        return (
          <TuduAnimatedWrapper key={tudu.id} layout={LinearTransition}>
            <ShrinkableView
              onPress={() => onTuduPress(tudu)}
              scaleFactor={0.03}
              style={{
                height: 'auto',
                width: '100%',
                zIndex: 0,
                marginBottom: 8,
              }}>
              {SwipeableTudu({ tudu, isActive: false })}
            </ShrinkableView>
          </TuduAnimatedWrapper>
        );
      },
      [onTuduPress, SwipeableTudu],
    );

    const handleDragBegin = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('soft');
    }, []);

    const handleDragEnd: (params: DragEndParams<TudusListRow>) => void =
      useCallback(
        ({ data }) => {
          setDragVersion(v => v + 1);
          if (!hasSections) {
            const reordered = data
              .filter(
                (r): r is TudusListRow & { type: 'tudu' } => r.type === 'tudu',
              )
              .map(r => r.tudu);
            setTudus([...reordered, ...doneTudus]);
            return;
          }

          let currentSectionId: string | undefined = undefined;
          const reorderedUndone: TuduViewModel[] = [];

          for (const row of data) {
            if (row.type === 'section_header') {
              currentSectionId = row.section.id;
            } else if (row.type === 'tudu') {
              const cloned = row.tudu.clone();
              cloned.sectionId = currentSectionId;
              reorderedUndone.push(cloned);
            }
          }

          const allUpdated = [...reorderedUndone, ...doneTudus];
          setTudus(allUpdated);
        },
        [doneTudus, hasSections, setTudus],
      );

    const handleModalClose = useCallback(() => {
      setTuduWaitingForConfirmation(null);
      setTimeout(closeCurrentlyOpenSwipeable, 500);
    }, [setTuduWaitingForConfirmation, closeCurrentlyOpenSwipeable]);

    const deletingSectionItemCount = useMemo(() => {
      if (!deletingSection) return 0;
      return tuduList.filter(t => t.sectionId === deletingSection.id).length;
    }, [deletingSection, tuduList]);

    return (
      <Container>
        <NestableScrollContainer
          style={{ flexGrow: 1, overflow: 'visible' }}
          contentContainerStyle={{ paddingBottom: 110 }}>
          {TopComponent}
          {flatRows.length === 0 && doneTudus.length === 0 && (
            <EmptyTudusState
              onAddPress={onInsertTuduPress}
              onAISuggestionsPress={onAISuggestionsPress}
              isSmartList={isSmartList}
            />
          )}

          {flatRows.length > 0 && (
            <NestableDraggableFlatList
              key={`draggable-list-${dragVersion}`}
              extraData={dragVersion}
              data={flatRows}
              renderItem={renderUndoneRow}
              keyExtractor={item => item.id}
              onDragEnd={handleDragEnd}
              style={{
                zIndex: 9999,
                flexGrow: 1,
                overflow: 'visible',
                marginBottom: 16,
              }}
              contentContainerStyle={{
                zIndex: 9999,
                overflow: 'visible',
                flexGrow: 1,
              }}
              removeClippedSubviews={false}
              windowSize={10}
              initialNumToRender={10}
              onDragBegin={handleDragBegin}
            />
          )}

          {doneTudus.length ? getSectionTitle(doneTudus.length) : undefined}
          <LegendList
            data={doneTudus}
            renderItem={renderDoneItem}
            estimatedItemSize={70}
            keyExtractor={item => `doneitem-${item.id}`}
            style={{ width: '100%', overflow: 'visible', marginTop: 16 }}
            contentContainerStyle={{
              overflow: 'visible',
              flexGrow: 1,
            }}
            removeClippedSubviews
            nestedScrollEnabled
          />
        </NestableScrollContainer>

        <SendToTodayModal
          tudu={tuduWaitingForConfirmation}
          onUpdateTudu={saveTudu}
          onClose={handleModalClose}
        />

        {/* Modal to rename a section */}
        <SectionModal
          visible={renameModalVisible}
          initialTitle={editingSection?.title}
          isEditing={true}
          onSave={handleSaveRenameSection}
          onRequestClose={() => {
            setRenameModalVisible(false);
            setEditingSection(null);
          }}
        />

        {/* Modal to delete a section */}
        <SectionDeleteModal
          visible={deleteModalVisible}
          section={deletingSection ?? undefined}
          itemCount={deletingSectionItemCount}
          onConfirm={handleConfirmDeleteSection}
          onRequestClose={() => {
            setDeleteModalVisible(false);
            setDeletingSection(null);
          }}
        />
      </Container>
    );
  },
);

export { TudusList };
