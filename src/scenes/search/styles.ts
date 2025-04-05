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