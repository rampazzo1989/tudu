import React, {memo, useContext, useEffect, useMemo, useState} from 'react';
import {SlideInRight} from 'react-native-reanimated';
import {TuduCard} from '../../../../components/tudu-card';
import {useListStateHelper} from '../../../../hooks/useListStateHelper';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {DraggableContextType} from '../../../../modules/draggable/draggable-context/types';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {TuduItem} from '../../../home/types';
import {Container} from './styles';
import {TudusListProps} from './types';

const TudusList: React.FC<TudusListProps> = memo(({onTuduPress}) => {
  const draggableContext =
    useContext<DraggableContextType<TuduItem>>(DraggableContext);
  const [enteringAnimation, setEnteringAnimation] = useState<
    typeof SlideInRight | undefined
  >(() => SlideInRight);

  useEffect(() => {
    setEnteringAnimation(undefined);
  }, []);

  const memoizedList = useMemo(() => {
    return draggableContext.data.map((draggableTudu, index) => {
      const tudu = draggableTudu.data[0];
      return (
        <DraggableView
          key={`${tudu.label}${index}`}
          payload={draggableTudu}
          enteringAnimation={enteringAnimation
            ?.duration(100)
            .delay(index * 50)}>
          <TuduCard data={tudu} key={tudu.label} onPress={onTuduPress} />
        </DraggableView>
      );
    });
  }, [draggableContext.data, enteringAnimation, onTuduPress]);

  return <Container>{memoizedList}</Container>;
});

export {TudusList};
