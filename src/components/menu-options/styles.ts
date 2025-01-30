import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const OptionLine = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  margin-left: 6px;
`;

export const OptionContainer = styled.TouchableOpacity`
  flex: 1;
`;

export const IconContainer = styled.View`
  height: 18px;
  width: 18px;
  align-items: stretch;
  justify-content: center;
`;

export const styles = StyleSheet.create({
  icon: {
    maxHeight: 16,
    width: 16,
    height: 16,
  },
});
