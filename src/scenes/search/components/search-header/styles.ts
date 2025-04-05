import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const ContentRow = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: -10px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  max-width: 70%;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 24px;
  margin-left: 10px;
`;

export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 56px;
  opacity: 0.4;
`;

export const styles = StyleSheet.create({
  pageIcon: {marginRight: -15, marginTop: 0},
  header: {height: 142}
});

export const Input = styled.TextInput`
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  opacity: 0.7;
`;

export const TitleBackground = styled(Animated.View)<{titleWidth: number}>`
  height: 82px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({theme}) => theme.colors.secondary};
`;
