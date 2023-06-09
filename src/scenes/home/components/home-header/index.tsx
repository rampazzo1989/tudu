import React, {memo} from 'react';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {Header} from '../../../../components/header';
import {
  ContentRow,
  LogoAndTitle,
  LogoIcon,
  LogoTitle,
  ProfileThumb,
  SearchAndProfile,
} from './styles';

const HomeHeader: React.FC = memo(() => {
  return (
    <Header>
      <ContentRow>
        <LogoAndTitle>
          <LogoIcon />
          <LogoTitle />
        </LogoAndTitle>
        <SearchAndProfile>
          <SearchIcon />
          <ProfileThumb initials="FR" />
        </SearchAndProfile>
      </ContentRow>
    </Header>
  );
});

export {HomeHeader};
