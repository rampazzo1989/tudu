import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';
import Animated from 'react-native-reanimated';

export const OptionsButtonContainer = styled(Animated.View as any)<{
  extraBottomMargin?: number;
}>`
  width: 44px;
  height: 44px;
  position: absolute;
  left: 20px;
  bottom: ${({extraBottomMargin}) => (extraBottomMargin ?? 0) + 30}px;
  elevation: 8;
  z-index: 10000;
  align-content: center;
  justify-content: center;
`;

export const OptionsButton = styled(ShrinkableView)`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({theme}) => theme.colors.optionsButtonBackground ?? '#2B3139'};
  border: 1px solid rgba(255, 255, 255, 0.12);
  align-items: center;
  justify-content: center;
`;

export const IconWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
