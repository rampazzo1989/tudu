import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {FadeIn, LinearTransition, SlideInRight} from 'react-native-reanimated';
import {
  Container,
  DoneTuduAnimatedContainer,
  InnerContainer,
  SectionTitle,
  TuduAnimatedContainer,
  TuduAnimatedWrapper,
} from './styles';
import {TudusListProps} from './types';

import {CheckMarkIcon} from '../animated-icons/check-mark';
import {DraggableView} from '../../modules/draggable/draggable-view';
import {TuduCard} from '../tudu-card';
import {
  DraggableContextType,
  DraggableItem,
} from '../../modules/draggable/draggable-context/types';
import {TuduViewModel} from '../../scenes/home/types';
import {DraggableContext} from '../../modules/draggable/draggable-context';
import {refreshListState} from '../../modules/draggable/draggable-utils';
import {SwipeableCardRef} from '../swipeable-card/types';
import {isToday} from '../../utils/date-utils';
import {DeleteIconActionAnimation} from '../animated-icons/delete-icon';

const LayoutAnimation = LinearTransition.springify().stiffness(300).damping(13).mass(0.3);

const TudusList: React.FC<TudusListProps> = memo(
  ({
    onTuduPress,
    onEditPress,
    onDeletePress,
    onStarPress,
    getAdditionalInformation,
    animateIcon,
    draggableEnabled = true,
  }) => {
    const draggableContext =
      useContext<DraggableContextType<TuduViewModel>>(DraggableContext);
    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof FadeIn | undefined
    >(() => FadeIn);

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

    const getSectionTitle = useCallback((undoneListLength: number) => {
      return (
        <SectionTitle
          title={undoneListLength ? 'Done' : 'All done'}
          key="allTudus"
          marginTop={undoneListLength ? 20 : 0}
          ControlComponent={
            undoneListLength ? undefined : <CheckMarkIcon autoPlay speed={3} />
          }
        />
      );
    }, []);

    const handleDeleteGenerator = useCallback(
      (deletingItem: TuduViewModel) => () => {
        onDeletePress(deletingItem);
        animateIcon?.(DeleteIconActionAnimation);
      },
      [animateIcon, onDeletePress],
    );

    const handleEditGenerator = useCallback(
      (editingItem: DraggableItem<TuduViewModel>) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem.data[0]);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );

    const handleSendToOrRemoveFromTodayGenerator = useCallback(
      (editingItem: DraggableItem<TuduViewModel>) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const dueDate = editingItem.data[0].dueDate;
          if (dueDate && isToday(dueDate)) {
            editingItem.data[0].dueDate = undefined;
            editingItem.data[0].scheduledOrder = undefined;
          } else {
            editingItem.data[0].dueDate = new Date();
          }
          refreshListState(draggableContext.data, draggableContext.setData);
          swipeableRef.current?.closeOptions();
        },
      [draggableContext.data, draggableContext.setData],
    );

    const [forceUpdate, setForceUpdate] = useState(0);

    useEffect(() => {
      setEnteringAnimation(undefined);
      setForceUpdate(x => x+1);
    }, []);

    const getTuduList = useMemo(() => {
      const {data} = draggableContext;
      const indexedTudus = data.map((indexedTudu, index) => ({
        indexedTudu,
        index,
      }));

      const undone = indexedTudus.filter(x => !x.indexedTudu.data[0].done);
      const done = indexedTudus.filter(x => x.indexedTudu.data[0].done);

      const undoneComponents = undone.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu.data[0];

        return (
          <TuduAnimatedWrapper key={`a${tudu.id}`}
            entering={enteringAnimation?.duration(100).delay(index * 50)} layout={LayoutAnimation}>
            <DraggableView
              payload={draggableTudu.indexedTudu}
              draggableEnabled={draggableEnabled}
              draggableViewKey={`${tudu.id}-${draggableTudu.index}-${forceUpdate}`}>
              <TuduAnimatedContainer>
                <TuduCard
                  data={tudu}
                  onPress={onTuduPress}
                  onDelete={handleDeleteGenerator(tudu)}
                  onEdit={handleEditGenerator(draggableTudu.indexedTudu)}
                  onStarPress={onStarPress}
                  onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                    draggableTudu.indexedTudu,
                  )}
                  additionalInfo={getAdditionalInformation(tudu)}
                />
              </TuduAnimatedContainer>
            </DraggableView>
          </TuduAnimatedWrapper>
        );
      });

      const doneComponents = done.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu.data[0];
        return (
          <TuduAnimatedWrapper key={`a${tudu.id}`} 
            entering={enteringAnimation?.duration(100).delay(index * 50)} layout={LayoutAnimation}>
            <DoneTuduAnimatedContainer>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onDelete={handleDeleteGenerator(tudu)}
                onEdit={handleEditGenerator(draggableTudu.indexedTudu)}
                onStarPress={onStarPress}
                onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                  draggableTudu.indexedTudu,
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

      return allTudus;
    }, [
      draggableContext.data,
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

    return (
      <Container>
        {!!getTuduList?.length && (
          <InnerContainer>{getTuduList}</InnerContainer>
        )}
      </Container>
    );
  },
);

export {TudusList};
