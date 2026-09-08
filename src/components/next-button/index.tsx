import React, { memo } from 'react';
import { NextStaticIcon } from '../../assets/static/tudu-icons';
import { Button } from './styles';
import { NextButtonProps } from './types';

const NextButton: React.FC<NextButtonProps> = memo(({ onPress, style }) => {
  return (
    <Button onPress={onPress} style={style}>
      <NextStaticIcon size={20} />
    </Button>
  );
});

export { NextButton };