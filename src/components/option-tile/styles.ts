import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as any;

export const OptionTileContainer = styled(AnimatedTouchable)`
  width: 120px;
  height: 114px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.10);
  justify-content: center;
  align-items: center;
  padding: 8px 6px;
`;

export const OptionTileText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
  max-width: 92%;
`;