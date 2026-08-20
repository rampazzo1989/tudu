import styled from 'styled-components/native';
import {ShrinkableView} from '../../../components/shrinkable-view';

export const Container = styled.View`
  width: 100%;
`;

export const Section = styled.View`
  margin-bottom: 24px;
  width: 100%;
`;

export const SectionTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

export const ProvidersRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`;

export const ProviderOption = styled(ShrinkableView)<{isSelected?: boolean}>`
  flex: 1;
  background-color: ${({isSelected, theme}) =>
    isSelected ? theme.colors.primary : theme.colors.listCard};
  border-radius: 14px;
  padding: 14px 6px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({isSelected, theme}) =>
    isSelected ? theme.colors.iconOverlay : 'transparent'};
`;

export const ProviderEmoji = styled.Text`
  font-size: 20px;
  margin-bottom: 6px;
`;

export const ProviderName = styled.Text<{isSelected?: boolean}>`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({isSelected, theme}) =>
    isSelected ? '#FFFFFF' : theme.colors.text};
  text-align: center;
`;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  width: 100%;
`;

export const InputWrapper = styled.View`
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  padding-vertical: 12px;
`;

export const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const HelpLink = styled.TouchableOpacity`
  margin-top: 10px;
  align-self: flex-start;
`;

export const HelpLinkText = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-decoration-line: underline;
`;

export const SecurityBadge = styled.View`
  flex-direction: row;
  background-color: rgba(121, 86, 191, 0.12);
  border-radius: 10px;
  padding: 12px;
  margin-top: 14px;
  align-items: center;
`;

export const SecurityText = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  flex: 1;
  margin-left: 10px;
  line-height: 16px;
`;

export const ToggleCard = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ToggleTextContainer = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const ToggleTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 4px;
`;

export const ToggleDescription = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const ButtonRow = styled.View`
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

export const PrimaryButton = styled(ShrinkableView)<{disabled?: boolean}>`
  background-color: ${({disabled, theme}) =>
    disabled ? '#585f69' : theme.colors.primary};
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

export const PrimaryButtonText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: #ffffff;
`;

export const SecondaryButton = styled(ShrinkableView)<{disabled?: boolean}>`
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  width: 100%;
`;

export const SecondaryButtonText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
`;

export const DangerButton = styled(ShrinkableView)`
  background-color: rgba(244, 67, 54, 0.12);
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(244, 67, 54, 0.3);
  width: 100%;
`;

export const DangerButtonText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: #ff6b6b;
`;

export const StatusFeedback = styled.View<{isSuccess?: boolean}>`
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background-color: ${({isSuccess}) =>
    isSuccess ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
  border-width: 1px;
  border-color: ${({isSuccess}) =>
    isSuccess ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
`;

export const StatusFeedbackText = styled.Text<{isSuccess?: boolean}>`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 13px;
  color: ${({isSuccess}) => (isSuccess ? '#81C784' : '#E57373')};
  text-align: center;
`;
