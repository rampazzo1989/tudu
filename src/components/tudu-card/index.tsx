import React, {memo, useCallback, useEffect, useState} from 'react';
import {toggle} from '../../utils/state-utils';
import {TuduCheckbox} from '../tudu-checkbox';
import {Card, CheckAndTextContainer, Label} from './styles';
import {SwipeableTuduCard} from './swipeable-tudu-card';
import {TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(({data, onPress, onDelete, onEdit}) => {
  const [internalDone, setInternalDone] = useState(data.done);

  useEffect(() => {
    setInternalDone(data.done);
  }, [data.done]);

  const handleTuduPress = useCallback(() => {
    setInternalDone(toggle);
    const toggleTimeout = data.done ? 0 : 100;
    setTimeout(() => onPress(data), toggleTimeout);
  }, [data, onPress]);

  return (
    <Card
      scaleFactor={0.03}
      onPress={handleTuduPress}
      onLongPress={() => {
        return undefined;
      }}
      done={internalDone}>
      <SwipeableTuduCard
        done={internalDone}
        onDelete={onDelete}
        onEdit={onEdit}
        onSendOrRemoveFromToday={() => console.log('Today')}>
        <CheckAndTextContainer done={data.done}>
          <Label done={internalDone}>{data.label}</Label>
          <TuduCheckbox checked={internalDone} onPress={handleTuduPress} />
        </CheckAndTextContainer>
        {/* <Favorite /> */}
      </SwipeableTuduCard>
    </Card>
  );
});

export {TuduCard};
