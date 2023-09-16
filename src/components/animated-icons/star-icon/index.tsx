import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const StarIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/star.json')}
      loop={false}
      componentName="StarIcon"
      {...props}
    />
  );
});

export {StarIcon};
