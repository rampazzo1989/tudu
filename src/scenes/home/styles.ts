import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../components/draggable-page-content/styles';
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

export const RightFadingGradient = styled(LinearGradient)`
  position: absolute;
  end: 0;
  width: 14px;
  height: 100%;
`;

export const LeftFadingGradient = styled(LinearGradient)`
  position: absolute;
  start: 0;
  width: 14px;
  height: 100%;
`;

export const PageContentContainer = styled.View`
  flex: 1;
  padding: 30px 16px;
  `;