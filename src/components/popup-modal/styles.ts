import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PopupContainer = styled(AnimatedTouchable).attrs({
  activeOpacity: 1,
})`
  min-width: 250px;
  max-width: 320px;
  background-color: ${({theme}) => theme.colors.popupBackground};
  border-radius: 8px;
  elevation: 15;
  padding: 14px 16px;
  padding-bottom: 2px;
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
`;

type ButtonsContainerProps = {shouldWrap: boolean};

export const ButtonsContainer = styled.View<ButtonsContainerProps>`
  flex-direction: row;
  align-items: center;
  flex-wrap: ${({shouldWrap}) => (shouldWrap ? 'wrap' : 'nowrap')};
  justify-content: space-around;
  padding-right: 10px;
  margin-top: 10px;
`;

type HighlightableComponent = {highlight?: boolean};

export const PopupButton = styled.TouchableOpacity<HighlightableComponent>`
  padding: 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #444b56;
  background-color: ${({highlight, theme}) =>
    highlight ? theme.colors.buttonHighlight : theme.colors.button};
  margin-left: 10px;
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
