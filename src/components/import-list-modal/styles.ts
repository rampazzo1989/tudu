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

export const ListNameBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;

export const ListNameText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
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

export const InfoCard = styled.View`
  background-color: rgba(121, 86, 191, 0.15);
  border-radius: 12px;
  padding: 12px;
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.3);
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

export const InfoText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
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
  background-color: ${({ theme }) => theme.colors.primary};
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
