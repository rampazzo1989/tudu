import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(Math.max(width * 0.18, 58), 70);

export const LockContainer = styled.View<{ insetsTop: number; insetsBottom: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.pageBackground};
  align-items: center;
  justify-content: center;
  padding-top: ${({ insetsTop }) => Math.max(insetsTop, 16)}px;
  padding-bottom: ${({ insetsBottom }) => Math.max(insetsBottom, 16) + 32}px;
  padding-horizontal: 20px;
`;

export const HeaderSection = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding-horizontal: 32px;
`;

export const AppIconWrapper = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary}25;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary}40;
`;

export const LockTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 8px;
`;

export const LockSubtitle = styled.Text<{ isError?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 14px;
  color: ${({ isError, theme }) =>
    isError ? '#FF5E5B' : theme.colors.text + '99'};
  text-align: center;
  min-height: 20px;
`;

export const DotsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-vertical: 8px;
  height: 28px;
`;

export const Dot = styled.View<{ isFilled: boolean; isError?: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  margin-horizontal: 8px;
  background-color: ${({ isFilled, isError, theme }) =>
    isError
      ? '#FF5E5B'
      : isFilled
      ? theme.colors.primary
      : 'transparent'};
  border-width: 2px;
  border-color: ${({ isFilled, isError, theme }) =>
    isError
      ? '#FF5E5B'
      : isFilled
      ? theme.colors.primary
      : theme.colors.text + '40'};
`;

export const KeypadContainer = styled.View`
  width: 100%;
  max-width: 270px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

export const KeypadRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-vertical: 5px;
`;

export const KeypadButton = styled.TouchableOpacity<{ isSpecial?: boolean }>`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE / 2}px;
  background-color: ${({ isSpecial, theme }) =>
    isSpecial ? 'transparent' : theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  border-width: ${({ isSpecial }) => (isSpecial ? '0px' : '1px')};
  border-color: ${({ isSpecial, theme }) =>
    isSpecial ? 'transparent' : 'rgba(255, 255, 255, 0.08)'};
`;

export const KeypadDigitText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.header};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const KeypadSpecialText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export const LockoutBadge = styled.View`
  background-color: #FF5E5B20;
  border-width: 1px;
  border-color: #FF5E5B60;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 12px;
  margin-top: 12px;
`;

export const LockoutText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: #FF5E5B;
  text-align: center;
`;
