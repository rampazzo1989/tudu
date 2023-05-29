import styled from 'styled-components/native';

export const PageContentContainer = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.pageBackground};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
`;
