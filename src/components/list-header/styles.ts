import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const ContentRow = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  max-width: 72%;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  color: ${({theme}) => theme.colors.headerText};
  font-size: 22px;
  font-weight: 700;
  margin-left: 12px;
`;

export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 48px;
  opacity: 0.4;
`;

export const styles = StyleSheet.create({
  pageIcon: {marginRight: -15, marginTop: 0},
});



