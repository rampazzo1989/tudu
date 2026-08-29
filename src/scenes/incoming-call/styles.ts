import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  background-color: #121620;
  justify-content: space-between;
  align-items: center;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '40px'};
  padding-bottom: ${Platform.OS === 'ios' ? '50px' : '30px'};
  padding-horizontal: 24px;
`;

export const TopBar = styled.View`
  width: 100%;
  align-items: center;
`;

export const StatusPill = styled.View<{ isConnected?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ isConnected }) =>
    isConnected ? 'rgba(76, 217, 100, 0.15)' : 'rgba(255, 255, 255, 0.12)'};
  border-width: 1px;
  border-color: ${({ isConnected }) =>
    isConnected ? 'rgba(76, 217, 100, 0.3)' : 'rgba(255, 255, 255, 0.18)'};
  border-radius: 20px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

export const StatusPillDot = styled.View<{ isConnected?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ isConnected }) =>
    isConnected ? '#4CD964' : '#FF9500'};
  margin-right: 8px;
`;

export const StatusPillText = styled.Text`
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const CenterContent = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const AvatarContainer = styled.View`
  width: 140px;
  height: 140px;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
`;

export const PulseCircle = styled(Animated.View)<{ size: number; color?: string }>`
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: ${({ size }) => `${size / 2}px`};
  background-color: ${({ color }) => color || 'rgba(121, 86, 191, 0.25)'};
`;

export const AvatarCircle = styled.View`
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: #7956bf;
  align-items: center;
  justify-content: center;
  shadow-color: #7956bf;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.6;
  shadow-radius: 16px;
  elevation: 12;
  border-width: 3px;
  border-color: rgba(255, 255, 255, 0.3);
`;

export const AvatarEmoji = styled.Text`
  font-size: 50px;
`;

export const TaskTitle = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  padding-horizontal: 16px;
  line-height: 32px;
`;

export const ListBadge = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  padding-horizontal: 14px;
  padding-vertical: 6px;
  border-radius: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
`;

export const ListBadgeText = styled.Text`
  color: #a188d2;
  font-size: 14px;
  font-weight: 600;
`;

export const CallingSubtitle = styled.Text`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 500;
`;

export const TimerText = styled.Text`
  color: #4cd964;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 4px;
`;

export const WaveformContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin-top: 20px;
  margin-bottom: 16px;
`;

export const WaveBar = styled(Animated.View)`
  width: 4px;
  border-radius: 2px;
  background-color: #7956bf;
  margin-horizontal: 3px;
`;

export const SpeechBubble = styled.View`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  margin-top: 12px;
  width: 100%;
  max-width: ${width - 48}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.12);
`;

export const SpeechBubbleText = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  font-style: italic;
`;

export const BottomControls = styled.View`
  width: 100%;
  align-items: center;
`;

export const RingingActionsRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  padding-horizontal: 20px;
`;

export const ActionButtonWrapper = styled.View`
  align-items: center;
`;

export const CircleCallButton = styled.TouchableOpacity<{ color: string }>`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  background-color: ${({ color }) => color};
  align-items: center;
  justify-content: center;
  shadow-color: ${({ color }) => color};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
  margin-bottom: 8px;
`;

export const CircleButtonIcon = styled.Text`
  font-size: 32px;
`;

export const ActionButtonLabel = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

export const SnoozePillButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding-horizontal: 20px;
  padding-vertical: 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
`;

export const SnoozePillIcon = styled.Text`
  font-size: 16px;
  margin-right: 8px;
`;

export const SnoozePillText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

export const InCallActionsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;
`;

export const InCallCardButton = styled.TouchableOpacity<{ bg?: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg || 'rgba(255, 255, 255, 0.08)'};
  border-radius: 16px;
  padding-vertical: 14px;
  padding-horizontal: 8px;
  align-items: center;
  justify-content: center;
  margin-horizontal: 4px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.12);
`;

export const InCallCardIcon = styled.Text`
  font-size: 22px;
  margin-bottom: 6px;
`;

export const InCallCardText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
`;

export const EndCallButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ff3b30;
  border-radius: 28px;
  padding-vertical: 16px;
  shadow-color: #ff3b30;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 10px;
  elevation: 6;
`;

export const EndCallText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
`;
