import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

export const FloatingButton = styled(ShrinkableView)<{
  extraBottomMargin?: number;
}>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
  right: 20px;
  bottom: ${({extraBottomMargin}) => (extraBottomMargin ?? 0) + 30}px;
  elevation: 10;
  z-index: 10000;
  align-content: center;
  justify-content: center;
`;

export const IconContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
