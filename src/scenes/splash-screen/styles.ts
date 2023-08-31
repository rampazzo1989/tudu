import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {LogoText} from '../../assets/static/logo_text';
import {TuduIcon} from '../../components/animated-icons/tudu-icon';

export const Spacer = styled.View`
  height: ${22 + StatusBar.length}px;
`;

export const AppIcon = styled(TuduIcon)`
  margin-top: 5px;
`;

export const Logo = styled(LogoText)`
  margin-right: 2px;
`;

export const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.secondary};
`;
