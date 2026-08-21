import styled from 'styled-components/native';
import { ShrinkableView } from '../../../components/shrinkable-view';

export const Container = styled.View`
  width: 100%;
`;

export const Section = styled.View`
  margin-bottom: 24px;
  width: 100%;
`;

export const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  width: 100%;
`;

export const AccountCard = styled.View`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const AccountInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 12px;
`;

export const Avatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  margin-right: 12px;
`;

export const AvatarFallback = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const AvatarFallbackText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 18px;
  color: #ffffff;
`;

export const AccountDetails = styled.View`
  flex: 1;
`;

export const AccountName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const AccountEmail = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const DisconnectButton = styled(ShrinkableView)`
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 8px;
  background-color: rgba(244, 67, 54, 0.15);
  border-width: 1px;
  border-color: rgba(244, 67, 54, 0.3);
`;

export const DisconnectButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: #ff8a80;
`;

export const ConnectButton = styled(ShrinkableView)<{ disabled?: boolean }>`
  background-color: #4285f4;
  border-radius: 12px;
  padding-vertical: 14px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const ConnectButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: #ffffff;
  margin-left: 8px;
`;

export const ActionTile = styled(ShrinkableView)<{ disabled?: boolean }>`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const ActionTileLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 12px;
`;

export const ActionIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const ActionTextContainer = styled.View`
  flex: 1;
`;

export const ActionTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
`;

export const ActionSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const ToggleCard = styled.View`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`;

export const ToggleTextContainer = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const ToggleTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const ToggleDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 6px;
  margin-bottom: 6px;
`;

export const ChipButton = styled.TouchableOpacity<{ selected?: boolean }>`
  flex: 1;
  padding-vertical: 10px;
  padding-horizontal: 8px;
  border-radius: 10px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.iconOverlay : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
`;

export const ChipText = styled.Text<{ selected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({ selected, theme }) => (selected ? '#FFFFFF' : theme.colors.text)};
`;

export const InfoBadge = styled.View`
  flex-direction: row;
  background-color: rgba(121, 86, 191, 0.12);
  border-radius: 10px;
  padding: 12px;
  margin-top: 14px;
  align-items: center;
`;

export const InfoText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  flex: 1;
  margin-left: 10px;
  line-height: 16px;
`;

export const LoadingOverlay = styled.View`
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 12px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const LoadingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: #ffffff;
  margin-left: 10px;
`;
