import styled from 'styled-components/native';
import {AppIcon} from '../../assets/static/app_icon';
import {LogoText} from '../../assets/static/logo_text';

export const HeaderContent = styled.View`
  width: 100%;
  height: 82px;
  margin-bottom: -16px;
  background-color: ${({theme}) => theme.colors.primary};
  padding-bottom: 32px;
  padding-left: 18px;
  padding-right: 18px;
  justify-content: flex-end;
`;

export const TitleBackground = styled.View`
  height: 82px;
  width: 130px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({theme}) => theme.colors.secondary};
`;
