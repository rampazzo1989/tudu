import {DraxScrollView} from 'react-native-drax';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

export const DEFAULT_PAGE_HORIZONTAL_PADDING = 20;

export const PageContentScroll = styled(DraxScrollView)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.pageBackground};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;
`;

export const PageContentContainer = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.pageBackground};
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;
  // padding: 0 16px;
  // border: 1px solid blue;
`;

export const TopFadingGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 28px;
  z-index: 9998;
  // border: 1px solid blue;
`;

export const BottomFadingGradient = styled(LinearGradient)`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 28px;
  z-index: 9998;
`;
