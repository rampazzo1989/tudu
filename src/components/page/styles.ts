import styled from 'styled-components/native';

export const PageContainer = styled.View`
  flex: 1;
`;


export const StatusBar = styled.StatusBar`
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {flex: 1},
}))`
  flex: 1;
`;
