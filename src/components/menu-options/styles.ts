import styled from 'styled-components/native';

export const OptionLine = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  margin-left: 2px;
`;

export const OptionContainer = styled.View`
  padding-bottom: 4px;
  flex: 1;
`;
