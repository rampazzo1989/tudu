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

import {AdjustIcon} from '../../../../components/animated-icons/adjust-icon';

const HomeHeader: React.FC<HomeHeaderProps> = memo(
  ({onSearchPress, onSettingsPress}) => {
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
            <ShrinkableView
              onPress={onSettingsPress}
              style={{marginLeft: 14}}>
              <AdjustIcon animateWhenIdle size={30} />
            </ShrinkableView>
          </SearchAndProfile>
        </ContentRow>
      </Header>
    );
  },
);

export {HomeHeader};
