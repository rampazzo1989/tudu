import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const ContentRow = styled(Animated.View as any)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

export const styles = StyleSheet.create({
  pageIcon: {marginRight: -5, marginTop: 0},
});
