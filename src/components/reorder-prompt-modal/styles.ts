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

/* Step 1: Ordering Options Styles */
export const StepHeader = styled.View`
  margin-top: 12px;
  margin-bottom: 8px;
`;

export const StepTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 2px;
`;

export const StepSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const OrderingOptionsContainer = styled.View`
  margin-top: 6px;
  gap: 8px;
`;

export const OrderingOptionCard = styled(ShrinkableView)<{ isSelected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(121, 86, 191, 0.16)' : 'rgba(255, 255, 255, 0.04)'};
  border-width: 1.5px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : 'rgba(255, 255, 255, 0.07)'};
`;

export const OptionRadioCircle = styled.View<{ isSelected?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : '#6D7886'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const OptionRadioInner = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const OptionTextContainer = styled.View`
  flex: 1;
`;

export const OptionTitle = styled.Text<{ isSelected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.contrastColor : '#A0AAB8'};
`;

export const OptionDesc = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-top: 2px;
`;

export const CustomPromptContainer = styled.View`
  margin-top: 4px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.35);
  padding: 10px 12px;
`;

export const CustomPromptInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contrastColor};
  min-height: 55px;
  max-height: 90px;
  text-align-vertical: top;
`;


/* Loading & Notice States */
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
