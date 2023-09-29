import React, {memo} from 'react';
import {Card, CheckAndTextContainer, Label} from './styles';
import {TuduCardProps} from './types';

const TuduCard = memo<TuduCardProps>(({data}) => {
  return (
    <Card>
      <SwipeableTuduCard>
        <CheckAndTextContainer>
          {/* <TuduCheck /> */}
          <Label>{data.label}</Label>
        </CheckAndTextContainer>
        {/* <Favorite /> */}
      </SwipeableTuduCard>
    </Card>
  );
});

export {TuduCard};
