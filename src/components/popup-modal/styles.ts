import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const PopupContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  min-width: 250px;
  min-height: 150px;
  max-width: 320px;
  background-color: ${({theme}) => theme.colors.popupBackground};
  border-radius: 8px;
  elevation: 15;
  padding: 14px 16px;
`;

export const PopupTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  margin-left: 14px;
  flex-wrap: wrap;
  flex: 1;
`;

export const PopupTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SeparatorContainer = styled.View`
  height: 1px;
  background-color: white;
  background-image: linear-gradient(to right, #3c414a, #ffffff, #3c414a);
`;

type ButtonsContainerProps = {shouldWrap: boolean};

export const ButtonsContainer = styled.View<ButtonsContainerProps>`
  flex-direction: row;
  align-items: center;
  flex-wrap: ${({shouldWrap}) => (shouldWrap ? 'wrap' : 'nowrap')};
  flex: 1;
  justify-content: space-around;
  padding-right: 10;
`;

type HighlightableComponent = {highlight?: boolean};

export const PopupButton = styled.TouchableOpacity<HighlightableComponent>`
  padding: 12px;
  border-radius: 8px;
  // elevation: 5;
  border-width: 1px;
  border-color: '#444B56';
  background-color: ${({highlight, theme}) =>
    highlight ? theme.colors.buttonHighlight : theme.colors.button};
  margin-left: 10px;
  margin-top: 10px;
  width: 100px;
  height: 42px;
  align-items: center;
`;

export const ButtonLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 14px;
`;

export const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
