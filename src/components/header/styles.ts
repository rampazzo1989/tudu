import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const HeaderContent = styled.View`
  width: 100%;
  height: 82px;
  margin-bottom: -16px;
  background-color: ${({theme}) => theme.colors.primary};
  padding-bottom: 16px;
  padding-left: 18px;
  padding-right: 18px;
  justify-content: center;
`;

export const TitleBackground = styled(Animated.View)<{titleWidth: number}>`
  height: 82px;
  width: ${({titleWidth}) => (titleWidth ? 85 + titleWidth : 130)}px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({theme}) => theme.colors.secondary};
`;
