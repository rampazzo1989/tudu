import React, {memo} from 'react';
import {HeaderContent, TitleBackground} from './styles';
import {HeaderProps} from './types';
import {Layout} from 'react-native-reanimated';

const Header: React.FC<HeaderProps> = memo(({children, titleWidth = 0}) => {
  return (
    <HeaderContent>
      <TitleBackground titleWidth={titleWidth} layout={Layout.duration(200)} />

      {children}
    </HeaderContent>
  );
});

export {Header};
