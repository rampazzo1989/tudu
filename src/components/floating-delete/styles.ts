import {StyleSheet} from 'react-native';
import {DraxView} from 'react-native-drax';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const Container = styled(DraxView)`
  border-radius: 20px;
  flex-direction: row;
  padding: 10px;
  background-color: transparent;
  border: 1px solid ${({theme}) => theme.colors.contrastColor};
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 18px;
  line-height: 18px;
  margin-left: 6px;
`;

export const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const styles = StyleSheet.create({
  receivingStyle: {opacity: 1, transform: [{scale: 1.1}]},
});
