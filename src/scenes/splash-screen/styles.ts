import {Dimensions, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {LogoText} from '../../assets/static/logo_text';
import {TuduIcon} from '../../components/animated-icons/tudu-icon';

export const Spacer = styled.View`
  height: ${StatusBar.currentHeight ?? 0}px;
`;

export const AppIcon = styled(TuduIcon)``;

export const Logo = styled(LogoText)`
  margin-top: -5px;
`;

export const StyledSafeAreaView = styled.View`
  /* flex: 1; */
  position: absolute;
  left: 0;
  right: 0;
  top: ${(StatusBar.currentHeight ?? 0) - 8}px;
  bottom: 0;
  /* height: ${Dimensions.get('screen').height}px; */
  /* margin-top: ${(StatusBar.currentHeight ?? 0) + 10}px; */
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.secondary};
`;
