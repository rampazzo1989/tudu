import React, { memo } from 'react';
import { NextIcon } from '../animated-icons/next-icon';
import { Button } from './styles';
import { NextButtonProps } from './types';

const NextButton: React.FC<NextButtonProps> = memo(({ onPress, style }) => {
  return (
    <Button onPress={onPress} style={style}>
      <NextIcon size={20} />
    </Button>
  );
});

export { NextButton };