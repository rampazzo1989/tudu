import Lottie from 'lottie-react-native';
import React, {memo, useEffect, useRef} from 'react';
import {useIdlyAnimatedComponent} from '../../../hooks/useIdlyAnimatedComponent';

const SearchIcon: React.FC = memo(() => {
  const animationRef = useRef<Lottie>(null);

  useIdlyAnimatedComponent(animationRef, 'SearchIcon', 60);

  return (
    <Lottie
      source={require('../../../assets/lottie/search.json')}
      ref={animationRef}
      loop={false}
      style={{marginLeft: 40}}
    />
  );
});

export {SearchIcon};
