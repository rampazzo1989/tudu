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

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  width: 100%;
`;

export const ToggleCard = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
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

export const TimeChipsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
`;

export const TimeChip = styled.TouchableOpacity<{selected?: boolean}>`
  flex: 1;
  padding-vertical: 8px;
  border-radius: 10px;
  background-color: ${({selected, theme}) =>
    selected ? theme.colors.primary : theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: ${({selected, theme}) =>
    selected ? theme.colors.iconOverlay : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
`;

export const TimeChipText = styled.Text<{selected?: boolean}>`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({selected, theme}) => (selected ? '#FFFFFF' : theme.colors.text)};
`;

export const TimePickerWrapper = styled.View`
  height: 140px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  border-radius: 12px;
  overflow: hidden;
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
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  flex: 1;
  margin-left: 10px;
  line-height: 16px;
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

export const TimePickerSectionTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 12px;
`;

export const EmojiIcon = styled.Text`
  font-size: 16px;
`;

