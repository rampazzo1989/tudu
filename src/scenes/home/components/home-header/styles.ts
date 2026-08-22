import styled from 'styled-components/native';
import {LogoText} from '../../../../assets/static/logo_text';
import {ProfileIcon} from '../../../../components/animated-icons/profile-icon';
import {TuduIcon} from '../../../../components/animated-icons/tudu-icon';
import {ShrinkableView} from '../../../../components/shrinkable-view';

export const LogoAndTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LogoIcon = styled(TuduIcon)`
  height: 32px;
  width: 32px;
`;

export const LogoTitle = styled(LogoText).attrs(() => ({}))`
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

