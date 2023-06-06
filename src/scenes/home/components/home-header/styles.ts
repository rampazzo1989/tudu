import styled from 'styled-components/native';
import {AppIcon} from '../../../../assets/static/app_icon';
import {LogoText} from '../../../../assets/static/logo_text';

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
