import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as any;

export const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;

export const PopupContainer = styled(AnimatedTouchable).attrs({
  activeOpacity: 1,
})<{minimumSized: boolean}>`
  background-color: ${({theme}) => theme.colors.popupBackground};
  border-radius: 8px;
  elevation: 15;
  padding: 14px 16px;
  border: 1px solid #ffffff30;
  margin-top: -8px;
  max-width: 90%;
  min-width: 284px;
`;

export const PopupTopContainer = styled(Animated.View)`
  padding: 14px 24px;
  width: auto;
  background-color: ${({theme}) => theme.colors.popupTopBackground};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  flex: 1;
  max-width: 90%;
  max-height: 110px;
`;

export const PopupTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  color: ${({theme}) => theme.colors.headerText};
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  margin-left: 10px;
  flex-wrap: wrap;
  max-width: 65%;
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

export const ButtonsContainer = styled(Animated.View)<{shouldMarginTop: boolean, alignCenter?: boolean}>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({alignCenter}) => (alignCenter ? 'center' : 'flex-end')};
  gap: 10px;
  height: 50px;
  margin-top: ${({shouldMarginTop}) => (shouldMarginTop ? 10 : 0)}px;
  width: 100%;
`;

type HighlightableComponent = {highlight?: boolean; isSingle?: boolean};

export const PopupButton = styled.TouchableOpacity<HighlightableComponent>`
  padding: 10px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ highlight, theme }) =>
    highlight ? theme.colors.primary : 'rgba(255, 255, 255, 0.12)'};
  background-color: ${({ highlight, theme }) =>
    highlight ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  min-width: ${({ isSingle }) => (isSingle ? '105px' : '0px')};
  flex: ${({ isSingle }) => (isSingle ? 'none' : '1')};
  height: 42px;
  align-items: center;
  justify-content: center;
`;

export const ButtonLabel = styled.Text<HighlightableComponent>`
  font-family: ${({ theme, highlight }) =>
    highlight ? theme.fonts.sectionTitle : theme.fonts.default};
  color: ${({ highlight }) =>
    highlight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)'};
  font-size: 13.5px;
  font-weight: ${({ highlight }) => (highlight ? '700' : '500')};
  text-align: center;
`;

export const TopContainerLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  color: ${({theme}) => theme.colors.text};
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
  padding: 12px 8px;
`;
