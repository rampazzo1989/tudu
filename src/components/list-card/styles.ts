import styled from 'styled-components/native';
import {NumberOfActiveItemsProps} from './types';

type HighlightableComponentProps = {
  isHighlighted: boolean;
};

export const ListCardContainer = styled.View<HighlightableComponentProps>`
  height: 46px;
  width: 100%;
  padding: 12px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: 10px;
`;

export const IconLabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.Text<HighlightableComponentProps>`
  font-family: ${({theme, isHighlighted}) =>
    isHighlighted
      ? theme.fonts.listCardLabelHighlighted
      : theme.fonts.listCardLabel};
  font-size: ${({isHighlighted}) => (isHighlighted ? 20 : 18)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const Container = styled.View<NumberOfActiveItemsProps>`
  height: 22px;
  width: 22px;
  border-radius: 11px;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted
      ? theme.colors.listCardNumberHighlighted
      : theme.colors.listCardNumber};
  justify-content: center;
  align-items: center;
`;

export const Number = styled.Text`
  font-family: ${({theme}) => theme.fonts.listCardLabel};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
`;
