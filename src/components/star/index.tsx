import React, {memo, useEffect, useRef} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {Touchable} from './styles';
import {StarProps} from './types';

const Star: React.FC<StarProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const sharedChecked = useSharedValue(checked);

  useEffect(() => {
    if (checked) {
      iconRef.current?.play({initialFrame: 530, finalFrame: 600});
    } else {
      iconRef.current?.play({initialFrame: 600, finalFrame: 530});
    }
    sharedChecked.value = checked;
  }, [checked, sharedChecked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: checked ? 1 : 0.2,
    };
  }, []);

  return (
    <Touchable onPress={onPress}>
      <BaseAnimatedIcon
        loop={false}
        style={{
          opacity: checked ? 1 : 0.2,
        }}
        ref={iconRef}
        source={require('../../assets/lottie/star-white.json')}
        componentName="Star"
        staticStateFrame={530}
        initialFrame={530}
        size={20}
      />
    </Touchable>
  );
});

export {Star};
