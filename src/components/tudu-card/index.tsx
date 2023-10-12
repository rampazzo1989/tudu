import React, {memo, useCallback} from 'react';
import {TuduCheckbox} from '../tudu-checkbox';
import {Card, CheckAndTextContainer, Label} from './styles';
import {SwipeableTuduCard} from './swipeable-tudu-card';
import {TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(({data, onPress}) => {
  // const onPress = useCallback(() => {
  //   data.done = !data.done;
  // }, [data]);

  return (
    <Card
      scaleFactor={0.03}
      onPress={() => {
        onPress(data);
      }}
      done={data.done}>
      <SwipeableTuduCard
        done={data.done}
        onDelete={() => console.log('Delete')}
        onEdit={() => console.log('Edit')}
        onSendOrRemoveFromToday={() => console.log('Today')}>
        <CheckAndTextContainer done={data.done}>
          <Label done={data.done}>{data.label}</Label>
          <TuduCheckbox checked={data.done} />
        </CheckAndTextContainer>
        {/* <Favorite /> */}
      </SwipeableTuduCard>
    </Card>
  );
});

export {TuduCard};
