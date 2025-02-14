import React, {memo, useEffect} from 'react';
import {HeaderContent, TitleBackground} from './styles';
import {HeaderProps} from './types';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';

const Header: React.FC<HeaderProps> = memo(
  ({children, titleWidth = 0, style}) => {
    const width = useSharedValue(130);

    useEffect(() => {
      const finalWidth = titleWidth ? 85 + titleWidth : 130;
      width.value = withTiming(finalWidth, { duration: 200 });
    }, [titleWidth]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: width.value,
      };
    });

    return (
      <HeaderContent style={style}>
        <TitleBackground style={[animatedStyle]} />
        {children}
      </HeaderContent>
    );
  },
);

export {Header};