import React, {memo} from 'react';
import {Label, Touchable} from './styles';
import {SwipeableOptionProps} from './types';

const SwipeableOptionButton: React.FC<SwipeableOptionProps> = memo(
  ({Icon, backgroundColor, onPress, text, progress, dragX}) => {
    return (
      <Touchable backgroundColor={backgroundColor} onPress={onPress}>
        <Icon autoPlay loop />
        <Label>{text}</Label>
      </Touchable>
    );
  },
);

export {SwipeableOptionButton};
