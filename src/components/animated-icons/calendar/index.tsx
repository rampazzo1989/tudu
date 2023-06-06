import Lottie from 'lottie-react-native';
import React, {memo, useEffect, useRef} from 'react';
import {useIdlyAnimatedComponent} from '../../../hooks/useIdlyAnimatedComponent';

const CalendarIcon: React.FC = memo(() => {
  const animationRef = useRef<Lottie>(null);

  useIdlyAnimatedComponent(animationRef, 'CalendarIcon', 60, 150);

  return (
    <Lottie
      source={require('../../../assets/lottie/calendar.json')}
      ref={animationRef}
      loop={false}
    />
  );
});

export {CalendarIcon};
