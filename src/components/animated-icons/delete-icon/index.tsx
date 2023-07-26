import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const DeleteIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/trash.json')}
      loop={false}
      componentName="DeleteIcon"
      animateWhenIdle
      {...props}
    />
  );
});

export {DeleteIcon};
