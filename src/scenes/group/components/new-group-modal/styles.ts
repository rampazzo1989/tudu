import styled from 'styled-components/native';

export const TitleContainer = styled.View`
  width: 240px;
`;
export const ListsContainer = styled.View`
  margin-top: 10px;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.text};
`;

export const TitleInput = styled.TextInput`
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  margin-top: 4px;
`;

export const Lists = styled.View`
  margin-top: 6px;
  width: 100%;
`;
