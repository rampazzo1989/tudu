import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  height: 38px;
  width: 38px;
  border-radius: 20px;
  background-color: ${({theme}) => theme.colors.profileThumbBackground};
  justify-content: center;
  align-items: center;
`;

export const Initials = styled.Text`
  font-family: ${({theme}) => theme.fonts.initials};
  font-size: 18px;
  color: ${({theme}) => theme.colors.profileThumbText};
`;
