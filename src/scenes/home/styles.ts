import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    paddingBottom: 30,
  },
});

export const TopFadingGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 28px;
  z-index: 9999;
`;

export const BottomFadingGradient = styled(LinearGradient)`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 28px;
  z-index: 9999;
`;
