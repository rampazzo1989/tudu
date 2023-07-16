import React, {memo} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps} from '../animated-icon/types';

const DropHere: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <BaseAnimatedIcon
      source={require('../../../assets/lottie/arrow_right.json')}
      loop={false}
      componentName="DropHere"
      initialFrame={0}
      finalFrame={180}
      animateWhenIdle
      {...props}
    />
  );
});

export {DropHere};
