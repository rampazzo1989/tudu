import { Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';
import Animated from 'react-native-reanimated';
import { DEFAULT_PAGE_HORIZONTAL_PADDING } from '../page-content/styles';

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingTop: 30,
    paddingBottom: 30,
    overflow: 'visible',
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
  z-index: 9999;
`;

export const FloatingAIButtonContainer = styled(Animated.View)<{
  extraBottomMargin?: number;
}>`
  position: absolute;
  right: 86px;
  bottom: ${({extraBottomMargin}) => (extraBottomMargin ?? 0) + 30}px;
  height: 56px;
  justify-content: center;
  align-items: center;
  elevation: 10;
  z-index: 10000;
`;


export const FloatingAIButton = styled(ShrinkableView)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`;

