import styled from 'styled-components/native';
import {NumberOfActiveItemsProps} from './types';
import {ShrinkableView} from '../shrinkable-view';
import Animated from 'react-native-reanimated';

type HighlightableComponentProps = {
  isHighlighted?: boolean;
};

export const ListCardContainer = styled(
  ShrinkableView,
)<HighlightableComponentProps>`
  min-height: 52px;
  width: 100%;
  padding: 10px 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: 14px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;

export const IconLabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Label = styled.Text<HighlightableComponentProps>`
  font-family: ${({theme, isHighlighted}) =>
    isHighlighted
      ? theme.fonts.listCardLabelHighlighted
      : theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({theme}) => theme.colors.text};
  margin-left: 10px;
  line-height: 20px;
  flex: 1;
`;


export const Container = styled.View<NumberOfActiveItemsProps>`
  min-width: 24px;
  height: 22px;
  padding-horizontal: 7px;
  border-radius: 8px;
  background-color: rgba(121, 86, 191, 0.16);
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.25);
  justify-content: center;
  align-items: center;
`;

export const Number = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({theme}) => theme.colors.contrastColor};
  font-weight: 600;
`;

export const ControlComponentContainer = styled.View`
  margin-right: 6px;
`;

export const Emoji = styled(Animated.Text)`
  color: ${({theme}) => theme.colors.headerText};
  font-size: 18px;
`;

