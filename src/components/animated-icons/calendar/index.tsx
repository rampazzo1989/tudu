import React, {memo} from 'react';
import {BaseAnimatedIcon} from '../animated-icon';
import {AnimatedIconProps} from '../animated-icon/types';

const CalendarIcon: React.FC<AnimatedIconProps> = memo(props => {
  return (
    <BaseAnimatedIcon
      source={require('../../../assets/lottie/calendar_black.json')}
      loop={false}
      componentName="CalendarIcon"
      initialFrame={60}
      finalFrame={60}
      {...props}
    />
  );
});

export {CalendarIcon};
