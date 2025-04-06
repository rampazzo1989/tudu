import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {FadeIn, FadeInUp, FadeOutUp, LinearTransition} from 'react-native-reanimated';
import {
  Container,
  OptionsIconContainer,
  OptionsTouchable,
  SectionTitle,
  TuduAnimatedContainer,
  TuduAnimatedWrapper,
} from './styles';
import {TudusListProps} from './types';
import {LegendList, LegendListRenderItemProps} from '@legendapp/list'
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {CheckMarkIcon} from '../animated-icons/check-mark';
import {TuduCard} from '../tudu-card';
import {TuduViewModel} from '../../scenes/home/types';
import {SwipeableCardRef} from '../swipeable-card/types';
import {isToday} from '../../utils/date-utils';
import {DeleteIconActionAnimation} from '../animated-icons/delete-icon';
import { PopoverMenu } from '../popover-menu';
import { DoneItemsOptions } from './done-items-options';
import { OptionsThreeDotsIcon } from '../animated-icons/options-arrow-down-icon';
import { BaseAnimatedIconRef } from '../animated-icons/animated-icon/types';
import { RefreshIcon } from '../animated-icons/refresh-icon';
import { DragEndParams, NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import { useListService } from '../../service/list-service-hook/useListService';
import { SwipeableTuduCard } from '../tudu-card/swipeable-tudu-card';
import { ShrinkableView } from '../shrinkable-view';
import { useTranslation } from 'react-i18next';

const TudusList: React.FC<TudusListProps> = memo(
  ({
    onTuduPress,
    onEditPress,
    onDeletePress,
    onClearAllDonePress,
    onUndoAllPress,
    onStarPress,
    setTudus,
    getAdditionalInformation,
    animateIcon,
    list,
    TopComponent,
  }) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const [allDoneReactionVisible, setAllDoneReactionVisible] = useState(false);
    const {t} = useTranslation();

    const {saveTudu} = useListService();

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

    const handleClearAllDonePress = useCallback(() => {
      const doneTudus = tuduList.filter(x => x.done);
      onClearAllDonePress(doneTudus);
      animateIcon?.(DeleteIconActionAnimation);
    }, [tuduList, onClearAllDonePress, animateIcon]);

    const handleUndoAllPress = useCallback(() => {
      const doneTudus = tuduList.filter(x => x.done);
      onUndoAllPress(doneTudus);
      animateIcon?.(RefreshIcon);
    }, [tuduList, onUndoAllPress]);

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
          from={OptionsComponent}
        >
          <DoneItemsOptions closeMenu={handlePopoverMenuRequestClose} onClearAllDone={handleClearAllDonePress} onUndoAll={handleUndoAllPress} />
        </PopoverMenu>
      ),
      [popoverMenuVisible, handlePopoverMenuRequestClose, OptionsComponent, handleClearAllDonePress]
    );

    const CheckMarkAnimation = useMemo(() => {
      return <CheckMarkIcon onAnimationFinish={() => setTimeout(() => setAllDoneReactionVisible(false), 1500)} autoPlay speed={3} />;
    }, [OptionsMenu]);

    useEffect(() => {
      var undoneLength = tuduList.filter(x => !x.done).length;
      setAllDoneReactionVisible(!undoneLength);
    }, [tuduList]);

    const getSectionTitle = useCallback((undoneListLength: number) => {
      return (
        <Animated.View layout={LinearTransition} entering={FadeInUp} exiting={FadeOutUp}>
        <SectionTitle
          title={undoneListLength ? t('sectionTitles.done') : t('sectionTitles.allDone')}
          key="allTudus"
          marginTop={0}
          ControlComponent={
            allDoneReactionVisible ? undefined : OptionsMenu
          }
          ReactionComponent={allDoneReactionVisible ? CheckMarkAnimation : undefined}
        />
        </Animated.View>
      );
    }, [allDoneReactionVisible, OptionsMenu, CheckMarkAnimation]);

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

    const handleSendToOrRemoveFromTodayGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const dueDate = editingItem.dueDate;
          if (dueDate && isToday(dueDate)) {
            editingItem.dueDate = undefined;
            editingItem.scheduledOrder = undefined;
          } else {
            editingItem.dueDate = new Date();
          }
          setTimeout(() => {
            saveTudu(editingItem);
            swipeableRef.current?.closeOptions();
          }, 700);
        },
      [saveTudu],
    );

    const indexedTudus = useMemo(() => tuduList.map((indexedTudu, index) => ({
      indexedTudu,
      index,
    })), [tuduList]);

    type IndexedTudu = typeof indexedTudus[number];

    const undoneIndexedTudus = useMemo(() => {
      return indexedTudus.filter(x => !x.indexedTudu.done);
    }, [indexedTudus]);

    const doneIndexedTudus = useMemo(() => {
      return indexedTudus.filter(x => x.indexedTudu.done);
    }, [indexedTudus]);

    const doneTudus = useMemo(() => {
      return tuduList.filter(x => x.done);
    }, [tuduList]);

    const SwipeableTudu : React.FC<{tudu: TuduViewModel, isActive: boolean}> = useCallback(({tudu, isActive}) => {
      return (
        <SwipeableTuduCard
                enabled={!isActive}
                done={tudu.done}
                onDelete={handleDeleteGenerator(tudu)}
                onEdit={handleEditGenerator(tudu)}
                isOnToday={tudu.dueDate && isToday(tudu.dueDate)}
                onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                  tudu,
                )}>
            <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onStarPress={onStarPress}
                additionalInfo={getAdditionalInformation(tudu)}
              />
            </SwipeableTuduCard>
      ); 
    }, [handleDeleteGenerator, handleEditGenerator, 
      handleSendToOrRemoveFromTodayGenerator, onStarPress, onTuduPress]);

    const renderItem = useCallback(({ item, drag, isActive, renderDone }: RenderItemParams<IndexedTudu> & {renderDone: boolean}) => {
      const tudu = item.indexedTudu;

      if (renderDone != tudu.done) {
        return null;
      }

      return (
      <ShadowDecorator elevation={5} color='black' opacity={1} radius={2}>
        <ScaleDecorator activeScale={1.05}>
          <ShrinkableView onPress={() => onTuduPress(tudu)} scaleFactor={0.03} 
            style={{ height: 'auto', width: '100%', zIndex: tudu.done ? 0 : 9999, marginBottom: 8}} 
            onLongPress={tudu.done ? undefined : drag} disabled={isActive}>
            {/* <SwipeableTudu tudu={tudu} isActive={isActive} /> */}
            {SwipeableTudu({tudu, isActive})}
          </ShrinkableView>
        </ScaleDecorator>
      </ShadowDecorator>
      );
    }, [handleDeleteGenerator, handleEditGenerator, handleSendToOrRemoveFromTodayGenerator, onStarPress, onTuduPress]);

    const renderUndoneItem = useCallback((params: RenderItemParams<IndexedTudu>) => renderItem({...params, renderDone: false}), [renderItem]);
    const renderDoneItem = useCallback(({ item: tudu }: LegendListRenderItemProps<TuduViewModel>) => {
      if (!tudu.done)
        return null;

      return (
        <TuduAnimatedWrapper key={tudu.id}
          layout={LinearTransition}>
            <ShrinkableView onPress={() => onTuduPress(tudu)} scaleFactor={0.03} 
              style={{ height: 'auto', width: '100%', zIndex: tudu.done ? 0 : 9999, marginBottom: 8}} >
                {SwipeableTudu({tudu, isActive: false})}
            </ShrinkableView>
            </TuduAnimatedWrapper>
        );
    }, [renderItem]);

    const handleDragBegin = useCallback(() => {
      RNReactNativeHapticFeedback.trigger('soft');
    }, []);

    const handleDragEnd: (params: DragEndParams<IndexedTudu>) => void = useCallback(({ data }) => {
      setTudus([...data.flatMap(x => x.indexedTudu), ...doneIndexedTudus.flatMap(x => x.indexedTudu)]);
    }, [setTudus, doneIndexedTudus]);

    return (
      <Container>
         <NestableScrollContainer style={{flexGrow: 1,  overflow:'visible'}}>
          {TopComponent}
          {undoneIndexedTudus.length 
          ? <NestableDraggableFlatList
              data={undoneIndexedTudus}
              renderItem={renderUndoneItem}
              itemLayoutAnimation={LinearTransition}
              enableLayoutAnimationExperimental
              keyExtractor={(item) => `item-${item.indexedTudu.id}-${item.index}`}
              onDragEnd={handleDragEnd}
              style={{zIndex: 9999,  flexGrow: 1, overflow: 'visible', marginBottom: 16}}
              contentContainerStyle={{zIndex: 9999, overflow: 'visible', 
                flexGrow: 1,
              }}
              removeClippedSubviews
              windowSize={8}
              initialNumToRender={8}
              onDragBegin={handleDragBegin}
            /> : undefined}
            {doneTudus.length ? getSectionTitle(doneTudus.length) : undefined}
                <LegendList
                  data={doneTudus}
                  renderItem={renderDoneItem}
                  estimatedItemSize={70}
                  keyExtractor={(item, index) => `doneitem-${item.id}`}
                  style={{ width: '100%', overflow: 'visible', marginTop: 16}}
                  contentContainerStyle={{ overflow: 'visible', 
                    flexGrow: 1
                  }}
                  removeClippedSubviews
                  nestedScrollEnabled
                  />
            </NestableScrollContainer>
            
      </Container>
    );
  },
);

export {TudusList};
