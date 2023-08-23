import styled from 'styled-components/native';
import {AppIcon} from '../../../../assets/static/app_icon';
import {LogoText} from '../../../../assets/static/logo_text';
import {ProfileIcon} from '../../../../components/animated-icons/profile-icon';
import {ProfileThumb as Profile} from '../../../../components/profile-thumb';

export const LogoAndTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LogoIcon = styled(AppIcon).attrs(() => ({
  height: 30,
  width: 30,
}))``;

export const LogoTitle = styled(LogoText).attrs(() => ({}))`
  margin-left: 8px;
`;

export const ContentRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SearchAndProfile = styled.View`
  flex-direction: row;
  align-items: center;
  width: 22%;
  height: 100%;
`;

export const StyledProfileIcon = styled(ProfileIcon)`
  margin-left: 6px;
`;
