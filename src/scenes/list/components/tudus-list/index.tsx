import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View} from 'react-native';
import Animated, {SlideInRight} from 'react-native-reanimated';
import {CheckMarkIcon} from '../../../../components/animated-icons/check-mark';
import {TuduCard} from '../../../../components/tudu-card';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {
  deleteItem,
  refreshListState,
} from '../../../../modules/draggable/draggable-utils';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {TuduItem} from '../../../home/types';
import {Container, SectionTitle} from './styles';
import {TudusListProps} from './types';
import Toast from 'react-native-toast-message';
import {showItemDeletedToast} from '../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {DeleteIconActionAnimation} from '../../../../components/animated-icons/delete-icon';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';

const TudusList: React.FC<TudusListProps> = memo(
  ({onTuduPress, onEditPress, animateIcon}) => {
    const draggableContext =
      useContext<DraggableContextType<TuduItem>>(DraggableContext);
    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof SlideInRight | undefined
    >(() => SlideInRight);
    const {t} = useTranslation();

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

    const handleTuduPress = useCallback(
      (tudu: TuduItem) => {
        onTuduPress(tudu);
      },
      [onTuduPress],
    );

    const getSectionTitle = useCallback((undoneListLength: number) => {
      return (
        <SectionTitle
          title={undoneListLength ? 'Done' : 'All done'}
          key="allTudus"
          style={{marginTop: undoneListLength ? 20 : 0}}
          ControlComponent={
            undoneListLength ? undefined : <CheckMarkIcon autoPlay speed={3} />
          }
        />
      );
    }, []);

    const handleUndoDeletion = useCallback(
      (
        list: DraggableItem<TuduItem>[],
        listSetter: (newData: DraggableItem<TuduItem>[]) => void,
      ) => {
        refreshListState(list, listSetter);
        Toast.hide();
      },
      [],
    );

    const handleDeleteGenerator = useCallback(
      (deletingItem: DraggableItem<TuduItem>) => () => {
        deleteItem(
          draggableContext.data,
          draggableContext.setData,
          deletingItem,
        );
        animateIcon?.(DeleteIconActionAnimation);

        showItemDeletedToast(t('toast.tuduDeleted'), () =>
          handleUndoDeletion(draggableContext.data, draggableContext.setData),
        );
      },
      [
        animateIcon,
        draggableContext.data,
        draggableContext.setData,
        handleUndoDeletion,
        t,
      ],
    );

    const handleEditGenerator = useCallback(
      (editingItem: DraggableItem<TuduItem>) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem.data[0]);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );

    const getTuduList = useMemo(() => {
      const {data} = draggableContext;
      const indexedTudu = data.map((x, index) => ({
        x,
        index,
      }));

      const sorted = indexedTudu.sort(
        (a, b) => Number(a.x.data[0].done) - Number(b.x.data[0].done),
      );

      const undone = sorted.filter(x => !x.x.data[0].done);
      const done = sorted.filter(x => x.x.data[0].done);

      const undoneComponents = undone.map((draggableTudu, index) => {
        const tudu = draggableTudu.x.data[0];

        return (
          <DraggableView
            payload={draggableTudu.x}
            key={`${tudu.label}${draggableTudu.index}`}
            draggableEnabled={!tudu.done}
            draggableViewKey={`${tudu.label}${index}`}>
            <Animated.View
              entering={enteringAnimation?.duration(100).delay(index * 50)}
              style={{flexGrow: 1, width: '100%'}}>
              <TuduCard
                data={tudu}
                onPress={handleTuduPress}
                onDelete={handleDeleteGenerator(draggableTudu.x)}
                onEdit={handleEditGenerator(draggableTudu.x)}
              />
            </Animated.View>
          </DraggableView>
        );
      });

      const doneComponents = done.map((draggableTudu, index) => {
        const tudu = draggableTudu.x.data[0];
        return (
          <DraggableView
            key={`${tudu.label}${draggableTudu.index}`}
            payload={draggableTudu.x}
            draggableEnabled={!tudu.done}
            draggableViewKey={`${tudu.label}${index}`}>
            <Animated.View
              entering={enteringAnimation?.duration(100).delay(index * 50)}
              style={{flexGrow: 1, width: '100%'}}>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onDelete={handleDeleteGenerator(draggableTudu.x)}
                onEdit={handleEditGenerator(draggableTudu.x)}
              />
            </Animated.View>
          </DraggableView>
        );
      });

      const allTudus = undoneComponents.concat(
        doneComponents.length
          ? [getSectionTitle(undoneComponents.length), ...doneComponents]
          : [],
      );

      return allTudus;
    }, [
      draggableContext,
      enteringAnimation,
      getSectionTitle,
      handleDeleteGenerator,
      handleEditGenerator,
      handleTuduPress,
      onTuduPress,
    ]);

    return (
      <Container>
        {!!getTuduList?.length && (
          <View style={{marginBottom: 18, marginTop: -6}}>{getTuduList}</View>
        )}
      </Container>
    );
  },
);

export {TudusList};
