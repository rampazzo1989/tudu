import React, {memo} from 'react';
import {HeaderContent, TitleBackground} from './styles';
import {HeaderProps} from './types';

const Header: React.FC<HeaderProps> = memo(({children}) => {
  return (
    <HeaderContent>
      <TitleBackground />

      {children}
    </HeaderContent>
  );
});

export {Header};
