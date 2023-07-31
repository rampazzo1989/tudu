import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../components/page-content/styles';
import {SectionTitle as Title} from '../../components/section-title';

export const SectionTitle = styled(Title)`
  margin-top: 18px;
`;

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
    paddingTop: 30,
  },
});
