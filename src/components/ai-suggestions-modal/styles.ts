import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const ModalContainer = styled.View`
  width: 90%;
  max-width: 360px;
  background-color: ${({ theme }) => theme.colors.popupBackground};
  border-radius: 18px;
  padding: 18px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.4;
  shadow-radius: 16px;
  elevation: 12;
`;

export const HeaderContainer = styled.View`
  margin-bottom: 8px;
`;

export const HeaderTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SparkleBadge = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const SparkleText = styled.Text`
  font-size: 15px;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  flex-shrink: 1;
`;

export const ModalSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-top: 4px;
  margin-left: 38px;
`;

export const CloseIconButton = styled(ShrinkableView)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.08);
`;

export const CloseIconText = styled.Text`
  font-size: 16px;
  color: #A0AAB8;
  font-weight: 600;
`;

export const ActionsBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-horizontal: 4px;
`;

export const ActionPill = styled(ShrinkableView)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;

export const ActionPillText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  font-weight: 600;
`;

export const ItemsScrollView = styled.ScrollView`
  max-height: 280px;
  margin-vertical: 6px;
`;

export const ItemRow = styled.TouchableOpacity<{ isSelected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 12px;
  border-radius: 10px;
  margin-bottom: 6px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(121, 86, 191, 0.18)' : 'rgba(255, 255, 255, 0.04)'};
  border-width: 1px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : 'rgba(255, 255, 255, 0.06)'};
`;

export const ItemTextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
  margin-right: 6px;
  justify-content: center;
`;

export const ItemLabel = styled.Text<{ isSelected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.itemLabel};
  font-size: 14px;
  line-height: 19px;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.contrastColor : '#A0AAB8'};
`;

export const ItemDismissButton = styled(ShrinkableView)`
  padding: 4px 6px;
  align-items: center;
  justify-content: center;
`;

export const ItemDismissText = styled.Text`
  font-size: 14px;
  color: #7E8895;
`;

export const LoadingContainer = styled.View`
  margin-vertical: 6px;
  padding-vertical: 4px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const LoadingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-top: 10px;
  margin-bottom: 4px;
  text-align: center;
`;

export const NoticeCard = styled.View`
  padding: 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  margin-vertical: 14px;
  align-items: center;
`;

export const NoticeIcon = styled.Text`
  font-size: 26px;
  margin-bottom: 8px;
`;

export const NoticeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-align: center;
  line-height: 18px;
  margin-bottom: 12px;
`;

export const NoticeButton = styled(ShrinkableView)`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const NoticeButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: #FFFFFF;
  font-weight: 600;
`;

export const FooterButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
`;

export const PrimaryConfirmButton = styled(ShrinkableView)<{ disabled?: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  border-radius: 10px;
  background-color: ${({ disabled, theme }) =>
    disabled ? '#585f69' : theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const PrimaryConfirmButtonText = styled.Text<{ disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#A0AAB8' : '#FFFFFF')};
  font-weight: 700;
`;

export const SecondaryCancelButton = styled(ShrinkableView)`
  padding-vertical: 12px;
  padding-horizontal: 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.08);
  align-items: center;
  justify-content: center;
`;

export const SecondaryCancelButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 14px;
  color: #A0AAB8;
`;
