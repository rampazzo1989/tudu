import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {SlideInRight} from 'react-native-reanimated';
import {TuduCard} from '../../../../components/tudu-card';
import {generateRandomHash} from '../../../../hooks/useHashGenerator';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {
  DraggableContextType,
  DraggableItem,
} from '../../../../modules/draggable/draggable-context/types';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {TuduItem} from '../../../home/types';
import {Container, SectionTitle} from './styles';
import {TudusListProps} from './types';

const TudusList: React.FC<TudusListProps> = memo(({onTuduPress}) => {
  const draggableContext =
    useContext<DraggableContextType<TuduItem>>(DraggableContext);
  const [enteringAnimation, setEnteringAnimation] = useState<
    typeof SlideInRight | undefined
  >(() => SlideInRight);
  const [keyHash, setKeyHash] = useState('');

  const updateHash = useCallback(() => {
    setKeyHash(generateRandomHash(''));
  }, []);

  useEffect(() => {
    setEnteringAnimation(undefined);
  }, []);

  const getTuduList = useCallback(
    (data: DraggableItem<TuduItem>[]) => {
      return data.map((draggableTudu, index) => {
        const tudu = draggableTudu.data[0];
        return (
          <DraggableView
            key={`${tudu.label}${keyHash}`}
            payload={draggableTudu}
            draggableEnabled={!tudu.done}
            enteringAnimation={enteringAnimation
              ?.duration(100)
              .delay(index * 50)}>
            <TuduCard data={tudu} key={tudu.label} onPress={onTuduPress} />
          </DraggableView>
        );
      });
    },
    [enteringAnimation, keyHash, onTuduPress],
  );

  const memoizedTuduList = useMemo(() => {
    const tudus = draggableContext.data.filter(x => !x.data[0].done);
    return getTuduList(tudus);
  }, [draggableContext.data, getTuduList]);

  const memoizedDoneList = useMemo(() => {
    const doneTudus = draggableContext.data?.filter(x => x.data[0].done);
    return getTuduList(doneTudus);
  }, [draggableContext.data, getTuduList]);

  return (
    <Container>
      {memoizedTuduList}
      {!!memoizedDoneList?.length && (
        <SectionTitle title={memoizedTuduList.length ? 'Done' : 'All done'} />
      )}
      {memoizedDoneList}
    </Container>
  );
});

export {TudusList};
