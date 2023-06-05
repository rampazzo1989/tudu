import React, {memo} from 'react';
import {
  HeaderContent,
  LogoIcon,
  LogoAndTitle,
  TitleBackground,
  LogoTitle,
} from './styles';
import {HeaderProps} from './types';

const Header: React.FC<HeaderProps> = memo(({children}) => {
  return (
    <HeaderContent>
      <TitleBackground />
      <LogoAndTitle>
        <LogoIcon />
        <LogoTitle />
      </LogoAndTitle>
      {children}
    </HeaderContent>
  );
});

export {Header};
