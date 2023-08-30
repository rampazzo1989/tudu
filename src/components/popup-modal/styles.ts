import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const KeyboardAvoidingView = styled.KeyboardAvoidingView``;

export const PopupContainer = styled(AnimatedTouchable).attrs({
  activeOpacity: 1,
})<{minimumSized: boolean}>`
  min-width: 280px;
  max-width: ${({minimumSized}) => (minimumSized ? 280 : 320)}px;
  background-color: ${({theme}) => theme.colors.popupBackground};
  border-radius: 8px;
  elevation: 15;
  padding: 14px 16px;
  border: 1px solid #ffffff30;
`;

export const PopupTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  margin-left: 10px;
  flex-wrap: wrap;
  max-width: 90%;
`;

export const PopupTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: start;
`;

export const SeparatorContainer = styled.View`
  height: 1px;
  background-color: white;
`;

export const ButtonsContainer = styled.View<{shouldMarginTop: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  margin-top: ${({shouldMarginTop}) => (shouldMarginTop ? 10 : 0)}px;
`;

type HighlightableComponent = {highlight?: boolean};

export const PopupButton = styled.TouchableOpacity<HighlightableComponent>`
  padding: 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #444b56;
  background-color: ${({highlight, theme}) =>
    highlight ? theme.colors.buttonHighlight : theme.colors.button};
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

export const ContentContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 12px;
`;
