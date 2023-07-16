import styled from 'styled-components/native';

export const ListGroupContainer = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.listCardGroup};
  padding: 8px;
  width: 100%;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.listCardGroupTitle};
  font-size: 16px;
  line-height: 24px;
  color: ${({theme}) => theme.colors.text};
`;
