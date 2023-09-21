import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const MoonIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/moon.json')}
      loop={false}
      componentName="MoonIcon"
      autoPlay
      {...props}
    />
  );
});

export {MoonIcon};
