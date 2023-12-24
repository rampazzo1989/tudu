import React, {memo, useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {Touchable} from './styles';
import {StarProps} from './types';

const CHECKED_FRAME = 600;
const UNCHECKED_FRAME = 530;

const Star: React.FC<StarProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const sharedChecked = useSharedValue(checked);
  // const [internalChecked, setInternalChecked] = useState(checked);
  const theme = useTheme();

  useEffect(() => {
    if (checked && !sharedChecked.value) {
      iconRef.current?.play({
        initialFrame: UNCHECKED_FRAME,
        finalFrame: CHECKED_FRAME,
      });
    } else if (!checked && sharedChecked.value) {
      iconRef.current?.play({
        initialFrame: CHECKED_FRAME,
        finalFrame: UNCHECKED_FRAME,
      });
    }

    sharedChecked.value = checked;
  }, [checked, sharedChecked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(sharedChecked.value ? 1 : 0.2),
    };
  }, []);

  return (
    <Touchable onPress={onPress}>
      <Animated.View style={animatedStyle}>
        <BaseAnimatedIcon
          loop={false}
          ref={iconRef}
          source={require('../../assets/lottie/star-white.json')}
          componentName="Star"
          staticStateFrame={checked ? CHECKED_FRAME : UNCHECKED_FRAME}
          initialFrame={checked ? CHECKED_FRAME : UNCHECKED_FRAME}
          overrideColor={checked ? theme.colors.star : 'white'}
          size={20}
        />
      </Animated.View>
    </Touchable>
  );
});

export {Star};
