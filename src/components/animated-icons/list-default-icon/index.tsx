import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const ListDefaultIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/list_icon.json')}
      loop={false}
      componentName="ListDefaultIcon"
      animateWhenIdle
      {...props}
    />
  );
});

export {ListDefaultIcon};
