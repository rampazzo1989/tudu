import {FlatList, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../../../components/draggable-page-content/styles';
import {Counter} from '../../types';

export const HorizontalSeparator = styled.View`
  height: 100%;
  width: 12px;
`;

export const HorizontalList = styled(FlatList as new () => FlatList<Counter>)`
  height: 100px;
`;

export const Container = styled(Animated.View)`
  flex-direction: row;
  margin-left: ${-DEFAULT_PAGE_HORIZONTAL_PADDING}px;
  margin-right: ${-DEFAULT_PAGE_HORIZONTAL_PADDING}px;
  margin-top: 14px;
`;

export const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
  listContentContainer: {
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
  },
});
