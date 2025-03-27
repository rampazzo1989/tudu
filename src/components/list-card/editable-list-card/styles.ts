import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {ShrinkableView} from '../../shrinkable-view';

type HighlightableComponentProps = {
  isHighlighted: boolean;
};

export const ListCardContainer = styled(
  ShrinkableView,
)<HighlightableComponentProps>`
  height: 54px;
  width: 100%;
  // flex-grow: 1;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: 10px;
  flex-direction: row;
  padding-horizontal: 16px;
`;

export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 18px;
`;
