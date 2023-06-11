import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const AdjustIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/adjust.json')}
      loop={false}
      componentName="AdjustIcon"
      animateWhenIdle
      initialFrame={90}
      {...props}
    />
  );
});

export {AdjustIcon};
