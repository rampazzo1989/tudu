import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

export const FloatingButton = styled(ShrinkableView)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
  right: 20px;
  bottom: 30px;
  elevation: 10;
`;
