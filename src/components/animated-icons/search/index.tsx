import React, {memo} from 'react';
import {AnimatedIconProps} from '../animated-icon/types';
import {AnimatedIcon} from './styles';

const SearchIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <AnimatedIcon
      loop={false}
      initialFrame={60}
      finalFrame={150}
      animateWhenIdle
      componentName="SearchIcon"
      source={require('../../../assets/lottie/search.json')}
      {...props}
    />
  );
});

export {SearchIcon};
