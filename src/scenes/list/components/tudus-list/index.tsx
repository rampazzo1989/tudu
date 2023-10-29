import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {SlideInRight} from 'react-native-reanimated';
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
import {TuduViewModel} from '../../../home/types';
import {
  Container,
  InnerContainer,
  SectionTitle,
  TuduAnimatedContainer,
} from './styles';
import {TudusListProps} from './types';
import Toast from 'react-native-toast-message';
import {showItemDeletedToast} from '../../../../utils/toast-utils';
import {useTranslation} from 'react-i18next';
import {DeleteIconActionAnimation} from '../../../../components/animated-icons/delete-icon';
import {SwipeableCardRef} from '../../../../components/swipeable-card/types';

const TudusList: React.FC<TudusListProps> = memo(
  ({onTuduPress, onEditPress, animateIcon}) => {
    const draggableContext =
      useContext<DraggableContextType<TuduViewModel>>(DraggableContext);
    const [enteringAnimation, setEnteringAnimation] = useState<
      typeof SlideInRight | undefined
    >(() => SlideInRight);
    const {t} = useTranslation();

    useEffect(() => {
      setEnteringAnimation(undefined);
    }, []);

    const handleTuduPress = useCallback(
      (tudu: TuduViewModel) => {
        onTuduPress(tudu);
      },
      [onTuduPress],
    );

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

    const handleUndoDeletion = useCallback(
      (
        list: DraggableItem<TuduViewModel>[],
        listSetter: (newData: DraggableItem<TuduViewModel>[]) => void,
      ) => {
        refreshListState(list, listSetter);
        Toast.hide();
      },
      [],
    );

    const handleDeleteGenerator = useCallback(
      (deletingItem: DraggableItem<TuduViewModel>) => () => {
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
      (editingItem: DraggableItem<TuduViewModel>) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem.data[0]);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );

    const getTuduList = useMemo(() => {
      const {data} = draggableContext;
      const indexedTudus = data.map((indexedTudu, index) => ({
        indexedTudu,
        index,
      }));

      const sorted = indexedTudus.sort(
        (a, b) =>
          Number(a.indexedTudu.data[0].done) -
          Number(b.indexedTudu.data[0].done),
      );

      const undone = sorted.filter(x => !x.indexedTudu.data[0].done);
      const done = sorted.filter(x => x.indexedTudu.data[0].done);

      const undoneComponents = undone.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu.data[0];

        return (
          <DraggableView
            payload={draggableTudu.indexedTudu}
            key={`${tudu.label}${draggableTudu.index}`}
            draggableEnabled={!tudu.done}
            draggableViewKey={`${tudu.label}${index}`}>
            <TuduAnimatedContainer
              entering={enteringAnimation?.duration(100).delay(index * 50)}>
              <TuduCard
                data={tudu}
                onPress={handleTuduPress}
                onDelete={handleDeleteGenerator(draggableTudu.indexedTudu)}
                onEdit={handleEditGenerator(draggableTudu.indexedTudu)}
              />
            </TuduAnimatedContainer>
          </DraggableView>
        );
      });

      const doneComponents = done.map((draggableTudu, index) => {
        const tudu = draggableTudu.indexedTudu.data[0];
        return (
          <DraggableView
            key={`${tudu.label}${draggableTudu.index}`}
            payload={draggableTudu.indexedTudu}
            draggableEnabled={!tudu.done}
            draggableViewKey={`${tudu.label}${index}`}>
            <TuduAnimatedContainer
              entering={enteringAnimation?.duration(100).delay(index * 50)}>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onDelete={handleDeleteGenerator(draggableTudu.indexedTudu)}
                onEdit={handleEditGenerator(draggableTudu.indexedTudu)}
              />
            </TuduAnimatedContainer>
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
          <InnerContainer>{getTuduList}</InnerContainer>
        )}
      </Container>
    );
  },
);

export {TudusList};
