import React, {memo, useEffect, useRef} from 'react';
import {AnimatedIconRef} from '../../../../components/animated-icons/animated-icon/types';
import {SearchIcon} from '../../../../components/animated-icons/search';
import {Header} from '../../../../components/header';
import {
  ContentRow,
  LogoAndTitle,
  LogoIcon,
  LogoTitle,
  SearchAndProfile,
  StyledProfileIcon,
} from './styles';

const HomeHeader: React.FC = memo(() => {
  const iconRef = useRef<AnimatedIconRef>(null);

  useEffect(() => {
    iconRef.current?.play({
      animationLayer: 'toggleOff',
      delay: 2000,
      onAnimationFinish: () => {
        iconRef.current?.play({animationLayer: 'toggleOn'});
      },
    });
  }, []);

  return (
    <Header>
      <ContentRow>
        <LogoAndTitle>
          <LogoIcon ref={iconRef} speed={2} />
          <LogoTitle />
        </LogoAndTitle>
        <SearchAndProfile>
          <SearchIcon animateWhenIdle size={30} />
          <StyledProfileIcon animateWhenIdle size={30} />
        </SearchAndProfile>
      </ContentRow>
    </Header>
  );
});

export {HomeHeader};
