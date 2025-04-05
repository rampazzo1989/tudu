import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity) as any;

export const Container = styled.View`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const Title = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.default};
    margin: 0;
`;

export const EmojiList = styled.ScrollView`
    flex-direction: row;
`;

export const EmojiButton = styled(AnimatedTouchable)<{selected: boolean, theme: DefaultTheme}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: ${({ selected }) => (selected ? '#6d5c95' : 'transparent')};
    border: ${({ selected, theme }) => (selected ? `1px solid ${theme.colors.suggestedEmoji.selectedEmojiBorder}` : 'none')};
    transition: background-color 0.3s ease;
`;

export const EmojiText = styled.Text`
    font-size: 24px;
`;

export const RightFadingGradient = styled(LinearGradient)`
  position: absolute;
  end: 0;
  width: 24px;
  height: 100%;
  z-index: 999;
`;