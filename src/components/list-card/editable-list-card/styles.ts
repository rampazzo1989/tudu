import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {ShrinkableView} from '../../shrinkable-view';

type HighlightableComponentProps = {
  isHighlighted: boolean;
};

export const ListCardContainer = styled(
  ShrinkableView,
)<HighlightableComponentProps>`
  min-height: 52px;
  width: 100%;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: 14px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
  flex-direction: row;
  padding-horizontal: 14px;
`;


export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 18px;
`;

