import React, {memo, useEffect, useState} from 'react';
import {toggle} from '../../utils/state-utils';
import {TuduCheckbox} from '../tudu-checkbox';
import {Card, CheckAndTextContainer, Label} from './styles';
import {SwipeableTuduCard} from './swipeable-tudu-card';
import {TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(({data, onPress}) => {
  const [internalDone, setInternalDone] = useState(data.done);

  useEffect(() => {
    setInternalDone(data.done);
  }, [data.done]);

  return (
    <Card
      scaleFactor={0.03}
      onPress={() => {
        setInternalDone(toggle);
        const toggleTimeout = data.done ? 0 : 100;
        setTimeout(() => onPress(data), toggleTimeout);
        // onPress(data);
      }}
      onLongPress={() => {
        return undefined;
      }}
      done={internalDone}>
      <SwipeableTuduCard
        done={internalDone}
        onDelete={() => console.log('Delete')}
        onEdit={() => console.log('Edit')}
        onSendOrRemoveFromToday={() => console.log('Today')}>
        <CheckAndTextContainer done={data.done}>
          <Label done={internalDone}>{data.label}</Label>
          <TuduCheckbox checked={internalDone} />
        </CheckAndTextContainer>
        {/* <Favorite /> */}
      </SwipeableTuduCard>
    </Card>
  );
});

export {TuduCard};
