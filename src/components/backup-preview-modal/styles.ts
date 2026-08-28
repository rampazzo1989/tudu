import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const ModalContainer = styled.View`
  width: 90%;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 20px;
  padding: 24px 20px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const IconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const TitleContainer = styled.View`
  flex: 1;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const ModalSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const DateBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  padding: 8px 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const DateBadgeLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const DateBadgeValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const StatBox = styled.View`
  flex: 1;
  min-width: 45%;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 10px 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.05);
`;

export const StatNumber = styled.Text`
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const StatLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const SettingsIncludedBadge = styled.View`
  background-color: rgba(121, 86, 191, 0.15);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.3);
`;

export const SettingsIncludedText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  margin-left: 8px;
  line-height: 16px;
`;

export const WarningCard = styled.View`
  background-color: rgba(244, 67, 54, 0.12);
  border-radius: 12px;
  padding: 12px;
  border-width: 1px;
  border-color: rgba(244, 67, 54, 0.25);
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

export const WarningText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: #ff8a80;
  flex: 1;
  margin-left: 8px;
  line-height: 16px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const PrimaryButton = styled(ShrinkableView)<{ disabled?: boolean }>`
  flex: 1;
  background-color: #e53935;
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const PrimaryButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: #ffffff;
`;

export const CancelButton = styled(ShrinkableView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

export const CancelButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;
