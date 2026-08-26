import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as any;

export const OptionContainer = styled(AnimatedTouchable)<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(66, 133, 244, 0.20)' : 'rgba(255, 255, 255, 0.05)'};
  border-width: 1px;
  border-color: ${({ isSelected }) =>
    isSelected ? '#4285F4' : 'rgba(255, 255, 255, 0.12)'};
  min-height: 28px;
`;

export const IconWrapper = styled.View<{ isSelected: boolean }>`
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.45)};
  align-items: center;
  justify-content: center;
`;

export const OptionText = styled.Text<{ isSelected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  margin-left: 5px;
  color: ${({ isSelected }) =>
    isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'};
`;

const AnimatedView = Animated.View as any;

export const ActiveDot = styled(AnimatedView)`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: #4285F4;
  margin-left: 4px;
`;

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
