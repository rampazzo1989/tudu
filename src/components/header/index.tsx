import React, {memo} from 'react';
import {HeaderContent} from './styles';
import {HeaderProps} from './types';

const Header: React.FC<HeaderProps> = memo(({children}) => {
  return <HeaderContent>{children}</HeaderContent>;
});

export {Header};
