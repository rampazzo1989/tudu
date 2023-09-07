import React, {memo} from 'react';
import {BackIcon} from '../animated-icons/back-icon';
import {Button} from './styles';
import {BackButtonProps} from './types';

const BackButton: React.FC<BackButtonProps> = memo(({onPress}) => {
  return (
    <Button onPress={onPress}>
      <BackIcon size={20} />
    </Button>
  );
});

export {BackButton};
