import React, {memo} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps} from '../animated-icon/types';

const SearchIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <BaseAnimatedIcon
      loop={false}
      initialFrame={60}
      finalFrame={150}
      staticStateFrame={60}
      animateWhenIdle
      componentName="SearchIcon"
      source={require('../../../assets/lottie/search.json')}
      {...props}
    />
  );
});

export {SearchIcon};
