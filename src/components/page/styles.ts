import {KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`;

export const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const StatusBar = styled.StatusBar`
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {flex: 1},
}))`
  flex: 1;
`;
