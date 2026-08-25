import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const ModalContainer = styled.View`
  width: 90%;
  max-width: 380px;
  background-color: ${({ theme }) => theme.colors.popupBackground};
  border-radius: 20px;
  padding: 20px 18px 18px 18px;
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
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const SparkleText = styled.Text`
  font-size: 16px;
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
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-top: 3px;
  margin-left: 40px;
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

/* Input Step Styles */
export const TextAreaContainer = styled.View`
  margin-top: 14px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.04);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.09);
  padding: 12px;
`;

export const TextAreaInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.contrastColor};
  min-height: 110px;
  max-height: 160px;
  text-align-vertical: top;
`;

export const InputFooterRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 6px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.05);
`;

export const TextCharCount = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const ClearTextButton = styled(ShrinkableView)`
  padding-vertical: 2px;
  padding-horizontal: 6px;
`;

export const ClearTextButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: #A0AAB8;
`;

/* Preview Step Styles */
export const ListTitleContainer = styled.View`
  margin-top: 12px;
  margin-bottom: 4px;
`;

export const ListTitleLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
  margin-left: 2px;
`;

export const ListTitleInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contrastColor};
  background-color: rgba(255, 255, 255, 0.05);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;

export const ActionsBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 6px;
  padding-horizontal: 2px;
`;

export const ItemCountBadge = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 8px;
  border-radius: 6px;
  background-color: rgba(121, 86, 191, 0.2);
`;

export const ItemCountBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const ActionPill = styled(ShrinkableView)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 4px;
  padding-horizontal: 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;

export const ActionPillText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  font-weight: 600;
`;

export const ItemsScrollView = styled.ScrollView`
  max-height: 220px;
  margin-vertical: 6px;
`;

export const ItemRow = styled.TouchableOpacity<{ isSelected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding-vertical: 9px;
  padding-horizontal: 10px;
  border-radius: 10px;
  margin-bottom: 5px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(121, 86, 191, 0.16)' : 'rgba(255, 255, 255, 0.03)'};
  border-width: 1px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
`;

export const ItemTextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
  margin-right: 6px;
  justify-content: center;
`;

export const ItemLabel = styled.Text<{ isSelected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.itemLabel};
  font-size: 13.5px;
  line-height: 18px;
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

/* Loading & Notice States */
export const LoadingContainer = styled.View`
  padding-vertical: 24px;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-top: 14px;
  text-align: center;
`;

export const NoticeCard = styled.View`
  padding: 20px 16px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.04);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  margin-top: 14px;
  margin-bottom: 4px;
  align-items: center;
`;

export const NoticeIcon = styled.Text`
  font-size: 30px;
  margin-bottom: 8px;
`;

export const NoticeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-align: center;
  line-height: 19px;
  margin-bottom: 16px;
  padding-horizontal: 6px;
`;

export const NoticeButton = styled(ShrinkableView)`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const NoticeButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: #FFFFFF;
  font-weight: 600;
`;

export const ErrorCard = styled.View`
  padding: 10px 14px;
  border-radius: 10px;
  background-color: rgba(255, 77, 79, 0.12);
  border-width: 1px;
  border-color: rgba(255, 77, 79, 0.3);
  margin-top: 10px;
  margin-bottom: 4px;
`;

export const ErrorText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: #FF7875;
  text-align: center;
  line-height: 16px;
`;

/* Footer Styles */
export const FooterButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`;

export const PrimaryConfirmButton = styled(ShrinkableView)<{ disabled?: boolean }>`
  flex: 1;
  padding-vertical: 13px;
  border-radius: 12px;
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
  padding-vertical: 13px;
  padding-horizontal: 18px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  align-items: center;
  justify-content: center;
`;

export const SecondaryCancelButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 14px;
  color: #A0AAB8;
`;
