import React, {memo} from 'react';
import {ProfileIcon} from '../../../../components/animated-icons/profile-icon';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {Header} from '../../../../components/header';
import {
  ContentRow,
  LogoAndTitle,
  LogoIcon,
  LogoTitle,
  ProfileThumb,
  SearchAndProfile,
  StyledProfileIcon,
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
          <SearchIcon size={30} />
          <StyledProfileIcon size={30} />
        </SearchAndProfile>
      </ContentRow>
    </Header>
  );
});

export {HomeHeader};
