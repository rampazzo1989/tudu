import React, {memo, useEffect} from 'react';
import {HeaderContent, TitleBackground} from './styles';
import {HeaderProps} from './types';
import {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';

const Header: React.FC<HeaderProps> = memo(
  ({children, titleWidth = 0, pillWidth, style}) => {
    const targetWidth = pillWidth ?? (titleWidth ? 85 + titleWidth : 130);
    const width = useSharedValue(targetWidth);
    const isFirstRender = React.useRef(true);

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        width.value = targetWidth;
        return;
      }
      width.value = withTiming(targetWidth, { duration: 150 });
    }, [targetWidth]);

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