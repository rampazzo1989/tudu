import styled from 'styled-components/native';

export const TitleContainer = styled.View`
  border-width: 1px;
  border-radius: 8px;
  border-color: ${({theme}) => theme.colors.sectionTitleBorder};
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 16px;
  color: ${({theme}) => theme.colors.text};
  font-weight: 800;
  margin-top: 4px;
  margin-bottom: 4px;
`;
