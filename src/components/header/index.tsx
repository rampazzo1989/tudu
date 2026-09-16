import React, {memo, useEffect} from 'react';
import {HeaderContent, TitleBackground} from './styles';
import {HeaderProps} from './types';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Header: React.FC<HeaderProps> = memo(
  ({children, titleWidth = 0, pillWidth, style}) => {
    const targetWidth = pillWidth ?? (titleWidth ? 85 + titleWidth : 130);
    const width = useSharedValue(70);

    useEffect(() => {
      width.value = withSpring(targetWidth, {
        damping: 18,
        stiffness: 140,
        mass: 0.8,
      });
    }, [targetWidth, width]);

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