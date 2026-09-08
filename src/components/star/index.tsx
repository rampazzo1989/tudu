import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {StarFilledSvg, StarOutlineSvg} from '../../assets/static/tudu-icons';
import {Touchable} from './styles';
import {StarProps} from './types';

const CHECKED_FRAME = 600;
const UNCHECKED_FRAME = 530;

const Star: React.FC<StarProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const sharedChecked = useSharedValue(checked);
  const theme = useTheme();

  useEffect(() => {
    sharedChecked.value = checked;
  }, [checked, sharedChecked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(sharedChecked.value ? 1 : 0.2),
    };
  }, []);

  const handlePress = useCallback(() => {
    setIsAnimating(true);
    onPress();
  }, [onPress]);

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (isAnimating) {
      if (checked) {
        iconRef.current?.play({
          initialFrame: UNCHECKED_FRAME,
          finalFrame: CHECKED_FRAME,
          onAnimationFinish: handleAnimationFinish,
        });
      } else {
        iconRef.current?.play({
          initialFrame: CHECKED_FRAME,
          finalFrame: UNCHECKED_FRAME,
          onAnimationFinish: handleAnimationFinish,
        });
      }
    }
  }, [checked, isAnimating, handleAnimationFinish]);

  return (
    <Touchable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        {isAnimating ? (
          <BaseAnimatedIcon
            loop={false}
            ref={iconRef}
            source={require('../../assets/lottie/star-white.json')}
            componentName="Star"
            staticStateFrame={checked ? CHECKED_FRAME : UNCHECKED_FRAME}
            initialFrame={checked ? UNCHECKED_FRAME : CHECKED_FRAME}
            finalFrame={checked ? CHECKED_FRAME : UNCHECKED_FRAME}
            overrideColor={checked ? theme.colors.star : 'white'}
            size={20}
            onAnimationFinish={handleAnimationFinish}
          />
        ) : checked ? (
          <StarFilledSvg size={20} color={theme.colors.star} />
        ) : (
          <StarOutlineSvg size={20} color="white" />
        )}
      </Animated.View>
    </Touchable>
  );
});

export {Star};
