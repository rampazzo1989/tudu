import {Dimensions, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {LogoText} from '../../assets/static/logo_text';
import {TuduIcon} from '../../components/animated-icons/tudu-icon';

export const Spacer = styled.View`
  height: ${(StatusBar.currentHeight ?? 0) - 4}px;
`;

export const AppIcon = styled(TuduIcon)``;

export const Logo = styled(LogoText)`
  margin-top: -5px;
`;

export const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  /* height: ${Dimensions.get('screen').height}px; */
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.secondary};
`;
