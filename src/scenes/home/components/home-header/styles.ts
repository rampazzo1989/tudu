import styled from 'styled-components/native';
import {LogoText} from '../../../../assets/static/logo_text';
import {ProfileIcon} from '../../../../components/animated-icons/profile-icon';
import {CheckedLogoStaticIcon} from '../../../../assets/static/tudu-icons';
import {ShrinkableView} from '../../../../components/shrinkable-view';

export const LogoAndTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LogoIcon = styled(CheckedLogoStaticIcon).attrs(() => ({
  size: 36,
}))`
  height: 36px;
  width: 36px;
`;

export const LogoTitle = styled(LogoText).attrs(() => ({
  width: 73,
  height: 28,
}))`
  margin-left: 10px;
`;

export const ContentRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const SearchAndProfile = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;


export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

export const StyledProfileIcon = styled(ProfileIcon)`
  margin-left: 6px;
`;

export const ProHeaderBadgeButton = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(245, 158, 11, 0.18);
  border-width: 1px;
  border-color: rgba(245, 158, 11, 0.75);
  padding: 4px 8px;
  border-radius: 12px;
  margin-right: 4px;
`;

export const ProHeaderIcon = styled.Text`
  font-size: 13px;
  margin-right: 4px;
`;

export const ProHeaderLabel = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: #f59e0b;
  letter-spacing: 0.5px;
`;

