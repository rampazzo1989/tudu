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
  min-height: ${({isHighlighted}) => (isHighlighted ? '64px' : '52px')};
  width: 100%;
  padding: ${({isHighlighted}) =>
    isHighlighted ? '14px 16px' : '10px 14px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme, isHighlighted}) =>
    isHighlighted ? theme.colors.listCardHighlighted : theme.colors.listCard};
  border-radius: ${({isHighlighted}) => (isHighlighted ? '16px' : '14px')};
  border-width: 1px;
  border-color: ${({isHighlighted}) =>
    isHighlighted ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)'};
`;

export const IconLabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Label = styled.Text<HighlightableComponentProps>`
  font-family: ${({theme, isHighlighted}) =>
    isHighlighted
      ? theme.fonts.header
      : theme.fonts.sectionTitle};
  font-size: ${({isHighlighted}) => (isHighlighted ? '17px' : '15px')};
  font-weight: ${({isHighlighted}) => (isHighlighted ? '700' : '600')};
  color: ${({theme}) => theme.colors.text};
  margin-left: ${({isHighlighted}) => (isHighlighted ? '12px' : '10px')};
  line-height: ${({isHighlighted}) => (isHighlighted ? '22px' : '20px')};
  flex: 1;
`;


export const Container = styled.View<NumberOfActiveItemsProps>`
  min-width: ${({isHighlighted}) => (isHighlighted ? '28px' : '24px')};
  height: ${({isHighlighted}) => (isHighlighted ? '26px' : '22px')};
  padding-horizontal: ${({isHighlighted}) => (isHighlighted ? '8px' : '7px')};
  border-radius: ${({isHighlighted}) => (isHighlighted ? '9px' : '8px')};
  background-color: ${({isHighlighted}) =>
    isHighlighted ? 'rgba(76, 175, 80, 0.16)' : 'rgba(121, 86, 191, 0.16)'};
  border-width: 1px;
  border-color: ${({isHighlighted}) =>
    isHighlighted ? 'rgba(76, 175, 80, 0.30)' : 'rgba(121, 86, 191, 0.25)'};
  justify-content: center;
  align-items: center;
`;

export const Number = styled.Text<HighlightableComponentProps>`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: ${({isHighlighted}) => (isHighlighted ? '13px' : '12px')};
  color: ${({theme, isHighlighted}) =>
    isHighlighted ? '#81C784' : theme.colors.contrastColor};
  font-weight: ${({isHighlighted}) => (isHighlighted ? '700' : '600')};
`;

export const ControlComponentContainer = styled.View`
  margin-right: 6px;
`;

export const Emoji = styled(Animated.Text)<HighlightableComponentProps>`
  color: ${({theme}) => theme.colors.headerText};
  font-size: ${({isHighlighted}) => (isHighlighted ? '22px' : '18px')};
`;

