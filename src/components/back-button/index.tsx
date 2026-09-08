import React, {memo} from 'react';
import {BackStaticIcon} from '../../assets/static/tudu-icons';
import {Button} from './styles';
import {BackButtonProps} from './types';

const BackButton: React.FC<BackButtonProps> = memo(({onPress, style}) => {
  return (
    <Button onPress={onPress} style={style}>
      <BackStaticIcon size={20} />
    </Button>
  );
});

export {BackButton};
