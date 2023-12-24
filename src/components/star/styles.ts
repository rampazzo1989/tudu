import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

export const Touchable = styled(ShrinkableView).attrs({activeOpacity: 1})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
