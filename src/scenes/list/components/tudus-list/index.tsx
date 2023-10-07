import React, {memo, useContext, useMemo} from 'react';
import {TuduCard} from '../../../../components/tudu-card';
import {DraggableContext} from '../../../../modules/draggable/draggable-context';
import {DraggableContextType} from '../../../../modules/draggable/draggable-context/types';
import {DraggableView} from '../../../../modules/draggable/draggable-view';
import {TuduItem} from '../../../home/types';
import {Container} from './styles';
import {TudusListProps} from './types';

const TudusList: React.FC<TudusListProps> = memo(({}) => {
  const draggableContext =
    useContext<DraggableContextType<TuduItem>>(DraggableContext);

  const memoizedList = useMemo(() => {
    return draggableContext.data.map((draggableTudu, index) => {
      const tudu = draggableTudu.data[0];
      return (
        <DraggableView key={`${tudu.label}${index}`} payload={draggableTudu}>
          <TuduCard data={tudu} key={tudu.label} />
        </DraggableView>
      );
    });
  }, [draggableContext.data]);

  return <Container>{memoizedList}</Container>;
});

export {TudusList};
