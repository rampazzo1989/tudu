import {Dimensions, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../page-content/styles';

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
    paddingTop: 30,
    paddingBottom: 30,
  },
  skeleton: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    backgroundColor: '#3C414A',
    marginBottom: 8,
  },
});

export const CheersAnimationContainer = styled.View`
  position: absolute;
  width: ${Dimensions.get('screen').width}px;
  height: ${Dimensions.get('screen').height}px;
  z-index: 99999;
`;

export const LoadingAnimationContainer = styled.View`
  position: absolute;
  width: ${Dimensions.get('screen').width}px;
  height: ${Dimensions.get('screen').height}px;
  z-index: 99999;
  margin-top: -30px;
`;
