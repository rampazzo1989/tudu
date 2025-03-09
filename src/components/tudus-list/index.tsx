import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animated, {FadeIn, FadeInUp, LinearTransition, ReduceMotion} from 'react-native-reanimated';
import {
  Container,
  DoneTuduAnimatedContainer,
  OptionsIconContainer,
  OptionsTouchable,
  SectionTitle,
  TuduAnimatedWrapper,
} from './styles';
import {TudusListProps} from './types';

import {CheckMarkIcon} from '../animated-icons/check-mark';
import {TuduCard} from '../tudu-card';
import {List, TuduViewModel} from '../../scenes/home/types';
import {SwipeableCardRef} from '../swipeable-card/types';
import {isToday} from '../../utils/date-utils';
import {DeleteIconActionAnimation} from '../animated-icons/delete-icon';
import { PopoverMenu } from '../popover-menu';
import { DoneItemsOptions } from './done-items-options';
import { OptionsThreeDotsIcon } from '../animated-icons/options-arrow-down-icon';
import { BaseAnimatedIconRef } from '../animated-icons/animated-icon/types';
import { RefreshIcon } from '../animated-icons/refresh-icon';
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import { useListService } from '../../service/list-service-hook/useListService';
import { SwipeableTuduCard } from '../tudu-card/swipeable-tudu-card';
import { ShrinkableView } from '../shrinkable-view';

const LayoutAnimation = LinearTransition.springify().stiffness(300).damping(13).mass(0.3);

const TudusList: React.FC<TudusListProps> = memo(
  ({
    onTuduPress,
    onEditPress,
    onDeletePress,
    onClearAllDonePress,
    onUndoAllPress,
    onStarPress,
    getAdditionalInformation,
    animateIcon,
    list,
    draggableEnabled = true,
  }) => {
    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof FadeIn | undefined
    >(() => FadeIn);
    const iconRef = useRef<BaseAnimatedIconRef>(null);
    const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
    const [allDoneReactionVisible, setAllDoneReactionVisible] = useState(false);

    const {saveTudu, saveListAndTudus} = useListService();

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

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

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
        <Animated.View layout={LinearTransition}>
        <SectionTitle
          title={undoneListLength ? 'Done' : 'All done'}
          key="allTudus"
          marginTop={undoneListLength ? 16 : 0}
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

    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => {
      setEnteringAnimation(undefined);
      setForceUpdate(x => x+1);
    }, []);

    const undoneTudus = useMemo(() => {
      const indexedTudus = tuduList.map((indexedTudu, index) => ({
        indexedTudu,
        index,
      }));

      const undone = indexedTudus.filter(x => !x.indexedTudu.done).map(x => x.indexedTudu);
      // const undone = indexedTudus.filter(x => !x.indexedTudu.data[0].done).map(x => x.indexedTudu);
      // const done = indexedTudus.filter(x => x.indexedTudu.data[0].done);

      return undone;
    }, [tuduList]);

    const doneTudus = useMemo(() => {
      return tuduList.filter(x => x.done);
    }, [tuduList]);

    const getTuduList = useMemo(() => {
      const indexedTudus = tuduList.map((indexedTudu, index) => ({
        indexedTudu,
        index,
      }));

      const undone = indexedTudus.filter(x => !x.indexedTudu.done);
      const done = indexedTudus.filter(x => x.indexedTudu.done);

      const undoneComponents = undone.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu;

        return (
          // <TuduAnimatedWrapper key={`a${tudu.id}`}
          //   entering={enteringAnimation?.duration(100).delay(index * 50)} layout={LayoutAnimation}>
          //   <DraggableView
          //     payload={draggableTudu.indexedTudu}
          //     draggableEnabled={draggableEnabled}
          //     draggableViewKey={`${tudu.id}-${draggableTudu.index}-${forceUpdate}`}>
          //     <TuduAnimatedContainer>
          //       <TuduCard
          //         data={tudu}
          //         onPress={onTuduPress}
          //         onDelete={handleDeleteGenerator(tudu)}
          //         onEdit={handleEditGenerator(draggableTudu.indexedTudu)}
          //         onStarPress={onStarPress}
          //         onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
          //           draggableTudu.indexedTudu,
          //         )}
          //         additionalInfo={getAdditionalInformation(tudu)}
          //       />
          //     </TuduAnimatedContainer>
          //   </DraggableView>
          // </TuduAnimatedWrapper>
        <></>
         
        );
      });

      const doneComponents = done.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu;
        return (
          <TuduAnimatedWrapper key={`a${tudu.id}`}
            entering={enteringAnimation?.duration(100).delay(index * 50)} layout={LayoutAnimation}>
            <DoneTuduAnimatedContainer>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onDelete={handleDeleteGenerator(tudu)}
                onEdit={handleEditGenerator(tudu)}
                onStarPress={onStarPress}
                onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                  tudu,
                )}
              />
            </DoneTuduAnimatedContainer>
          </TuduAnimatedWrapper>
        );
      });

      const allTudus = undoneComponents.concat(
        doneComponents.length
          ? [getSectionTitle(undoneComponents.length), ...doneComponents]
          : [],
      );

      // return allTudus;

      return doneComponents;
    }, [
      draggableEnabled,
      enteringAnimation,
      getAdditionalInformation,
      getSectionTitle,
      handleDeleteGenerator,
      handleEditGenerator,
      handleSendToOrRemoveFromTodayGenerator,
      onStarPress,
      onTuduPress,
    ]);

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<TuduViewModel>) => {
      return (
        // <ScaleDecorator>
        //   <TouchableOpacity
        //     onLongPress={drag}
        //     disabled={isActive}
        //     style={[
        //       styles.rowItem,
        //       { backgroundColor: isActive ? "red" : item.backgroundColor },
        //     ]}
        //   >
        //     <Text style={styles.text}>{item.label}</Text>
        //   </TouchableOpacity>
        // </ScaleDecorator>
          <ShadowDecorator elevation={5} color='black' opacity={1} radius={2}>
        <ScaleDecorator activeScale={1.05}>
        {/* <SwipeableItem
            key={tudu.id}ßß
            item={item}
            snapPointsLeft={[50]}
            // swipeDamping={5}
            renderUnderlayLeft={(a) => <View style={{backgroundColor: 'red', width: 150, height: 60}}><Text>{a.item.data[0].id}</Text></View>}
            // snapPointsLeft={[150]}
          > */}
          {/* <Swipeable renderLeftActions={() => <View style={{backgroundColor: 'red', width: 150, height: 60}}><Text>{tudu.id}</Text></View>}> */}
          <ShrinkableView onPress={() => onTuduPress(item)} scaleFactor={0.03} 
            style={{ height: 'auto', width: '100%', zIndex: 9999, marginBottom: 8}} 
            onLongPress={item.done ? undefined : drag} disabled={isActive}
            layout={LinearTransition} newKey={`item-${item.id}`}>
        <SwipeableTuduCard
              enabled={!isActive}
              done={item.done}
              onDelete={handleDeleteGenerator(item)}
              onEdit={handleEditGenerator(item)}
              isOnToday={item.dueDate && isToday(item.dueDate)}
              onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                item,
              )}>
                {/* <Card
                        scaleFactor={0.03}
                        onPress={handleTuduPress}
                        onLongPress={() => {
                          return undefined;
                        }}
                        done={internalDone}></Card> */}
        {/* <TuduAnimatedWrapper
            entering={enteringAnimation?.duration(100).delay((getIndex() ?? 0) * 50)} layout={LayoutAnimation}> */}
          {/* <TuduAnimatedContainer> */}
            {/* <View style={{backgroundColor: 'blue', height: 60, borderWidth: 1, borderColor: 'green'}}><Text>{tudu.label}</Text></View> */}
          {/* </TuduAnimatedContainer> */}
          {/* </TuduAnimatedWrapper> */}
          <TuduCard
              data={item}
              onPress={() => console.log('pressed')}
              onDelete={handleDeleteGenerator(item)}
              onEdit={handleEditGenerator(item)}
              onStarPress={onStarPress}
              onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                item,
              )}
              additionalInfo={getAdditionalInformation(item)}
            />
          </SwipeableTuduCard>
          </ShrinkableView>
          {/* </Swipeable> */}
          {/* </SwipeableItem> */}
          </ScaleDecorator>
          </ShadowDecorator>
      );
    };

    return (
      <Container>
        {/* {!!getTuduList?.length && (
          <InnerContainer>{getTuduList}</InnerContainer>
        )} */}
         <NestableScrollContainer style={{flexGrow: 1,  overflow:'visible'}}
        >
          <NestableDraggableFlatList
            data={[...undoneTudus]}
            renderItem={renderItem}
            keyExtractor={(item, index) => `item-${item.id}-${index}`}
            // onDragEnd={({data}) => saveAllTudus(data.flatMap(x => x.data))}
            onDragEnd={({data}) => {
              // saveAllTudus(data.flatMap(x => x.data));
              var a = data.flatMap(x => x);
              console.log('ONDRAGEND', {data: a});
              var newList = list?.clone();
              if(newList) {
                newList.tudus = a;
                saveListAndTudus(newList);
              }
            }}
            dragItemOverflow={true}
            style={{zIndex: 999999999,  flexGrow: 1, overflow: 'visible'}}
            contentContainerStyle={{zIndex: 999999999, overflow: 'visible', 
              flexGrow: 1
            }}
            // animationConfig={{
            //   mass: 1,
            //   damping: 12,
            //   stiffness: 100,
            //   overshootClamping: false,
            //   restDisplacementThreshold: 0.01,
            //   restSpeedThreshold: 2,
            // }}
            />
            {doneTudus.length ? getSectionTitle(undoneTudus.length) : undefined}
            {/* {getTuduList} */}
            <NestableDraggableFlatList
              data={[...doneTudus]}
              renderItem={renderItem}
              keyExtractor={(item, index) => `item-${item.id}-${index}`}
              // onDragEnd={({data}) => saveAllTudus(data.flatMap(x => x.data))}
              onDragEnd={({data}) => {
                // saveAllTudus(data.flatMap(x => x.data));
                var a = data.flatMap(x => x);
                console.log('ONDRAGEND', {data: a});
                var newList = list?.clone();
                if(newList) {
                  newList.tudus = a;
                  saveListAndTudus(newList);
                }
              }}
              dragItemOverflow={true}
              style={{zIndex: 999999999, width: '100%', overflow: 'visible', marginTop: 16}}
              contentContainerStyle={{zIndex: 999999999, overflow: 'visible', 
                flexGrow: 1
              }}
              
            />
            </NestableScrollContainer>
      </Container>
    );
  },
);

export {TudusList};
