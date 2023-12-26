import React, {memo, useRef} from 'react';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {Header} from '../../../../components/header';
import {ShrinkableView} from '../../../../components/shrinkable-view';
import {
  ContentRow,
  LogoAndTitle,
  LogoIcon,
  LogoTitle,
  SearchAndProfile,
  StyledProfileIcon,
} from './styles';
import {HomeHeaderProps} from './types';

const HomeHeader: React.FC<HomeHeaderProps> = memo(({onSearchPress}) => {
  const iconRef = useRef<AnimatedIconRef>(null);

  return (
    <Header>
      <ContentRow>
        <LogoAndTitle>
          <LogoIcon ref={iconRef} speed={2} />
          <LogoTitle />
        </LogoAndTitle>
        <SearchAndProfile>
          <ShrinkableView onPress={onSearchPress}>
            <SearchIcon animateWhenIdle size={30} />
          </ShrinkableView>
          {/* <StyledProfileIcon animateWhenIdle size={30} /> */}
        </SearchAndProfile>
      </ContentRow>
    </Header>
  );
});

export {HomeHeader};
