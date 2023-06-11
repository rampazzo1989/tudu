import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const HashIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/hash.json')}
      loop={false}
      componentName="StarIcon"
      animateWhenIdle
      {...props}
    />
  );
});

export {HashIcon};
