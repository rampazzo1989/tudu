import React, {memo} from 'react';
import {Card, CheckAndTextContainer, Label} from './styles';
import {SwipeableTuduCard} from './swipeable-tudu-card';
import {TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(({data}) => {
  return (
    <Card scaleFactor={0.03}>
      <SwipeableTuduCard
        done={data.done}
        onDelete={() => console.log('Delete')}
        onEdit={() => console.log('Edit')}
        onSendOrRemoveFromToday={() => console.log('Today')}>
        <CheckAndTextContainer>
          <Label>{data.label}</Label>
          {/* <TuduCheck /> */}
        </CheckAndTextContainer>
        {/* <Favorite /> */}
      </SwipeableTuduCard>
    </Card>
  );
});

export {TuduCard};
