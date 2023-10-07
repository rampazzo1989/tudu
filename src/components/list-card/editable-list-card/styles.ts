import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {ShrinkableView} from '../../shrinkable-view';

type HighlightableComponentProps = {
  isHighlighted: boolean;
};

export const ListCardContainer = styled(
  ShrinkableView,
)<HighlightableComponentProps>`
  height: 46px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: 10px;
`;

export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 18px;
`;
