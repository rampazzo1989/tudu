import React, {memo, useEffect, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {Touchable} from './styles';
import {StarProps} from './types';

const Star: React.FC<StarProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);

  useEffect(() => {
    if (checked) {
      iconRef.current?.play({initialFrame: 0, finalFrame: 6});
    } else {
      iconRef.current?.play({initialFrame: 6, finalFrame: 0});
    }
  }, [checked]);

  return (
    <Touchable onPress={onPress}>
      <BaseAnimatedIcon
        loop={false}
        ref={iconRef}
        source={require('../../assets/lottie/star-white.json')}
        componentName="Star"
        staticStateFrame={0}
        initialFrame={0}
        size={20}
      />
    </Touchable>
  );
});

export {Star};
