import styled from 'styled-components/native';

export const Card = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.tuduCard};
  border-radius: 10px;
`;

export const CheckAndTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text``;
