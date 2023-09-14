import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const SunIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/sun.json')}
      loop={false}
      componentName="SunIcon"
      autoPlay
      {...props}
    />
  );
});

export {SunIcon};
