import React, {memo} from 'react';
import {CalendarIcon} from '../../../../components/animated-icons/calendar';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {Header} from '../../../../components/header';
import {LogoAndTitle, LogoIcon, LogoTitle} from './styles';

const HomeHeader: React.FC = memo(() => {
  return (
    <Header>
      <LogoAndTitle>
        <LogoIcon />
        <LogoTitle />
        <SearchIcon />
        <CalendarIcon />
      </LogoAndTitle>
    </Header>
  );
});

export {HomeHeader};
