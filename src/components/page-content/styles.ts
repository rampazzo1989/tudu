import styled from 'styled-components/native';

export const DEFAULT_PAGE_HORIZONTAL_PADDING = 20;

export const PageContentContainer = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.pageBackground};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  padding: 30px ${DEFAULT_PAGE_HORIZONTAL_PADDING}px;
`;
