import {StyleSheet} from 'react-native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../components/page-content/styles';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  pageContent: {
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export const PaddedContainer = styled.View`
  padding: 0 ${DEFAULT_PAGE_HORIZONTAL_PADDING}px;
`;

export const EmptyStateContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

export const EmptyStateText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-align: center;
`;

