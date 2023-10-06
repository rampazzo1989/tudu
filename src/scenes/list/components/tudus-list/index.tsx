import React, {memo, useMemo} from 'react';
import {TuduCard} from '../../../../components/tudu-card';
import {DraggableItem} from '../../../../modules/draggable/draggable-context/types';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {Container} from './styles';
import {TudusListProps} from './types';

const TudusList: React.FC<TudusListProps> = memo(({data}) => {
  const draggableTudus = useMemo(
    () => data.map(tudu => new DraggableItem([tudu])),
    [data],
  );

  const memoizedList = useMemo(() => {
    return draggableTudus.map((draggableTudu, index) => {
      const tudu = draggableTudu.data[0];
      return (
        <DraggableView key={`${tudu.label}${index}`} payload={draggableTudu}>
          <TuduCard data={tudu} key={tudu.label} />
        </DraggableView>
      );
    });
  }, [draggableTudus]);

  return <Container>{memoizedList}</Container>;
});

export {TudusList};
