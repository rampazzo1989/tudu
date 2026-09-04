import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { OptionButton } from '../option-button';
import { ShrinkableView } from '../shrinkable-view';

const AnimatedView = Animated.View as any;

export const OptionsContainer = styled.View`
  flex-shrink: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const CurrentScheduleBadge = styled(AnimatedView)`
  width: 252px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 10px;
  background-color: rgba(121, 86, 191, 0.14);
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.35);
  margin-bottom: 14px;
`;

export const CurrentScheduleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-weight: 500;
`;

export const OptionButtonStyled = styled(OptionButton)`
  margin-top: 8px;
`;

export const ModeSelectorContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  border-radius: 12px;
  padding: 3px;
  margin-bottom: 14px;
  width: 252px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
`;

export const ModeButton = styled(ShrinkableView)<{ active?: boolean }>`
  flex: 1;
  padding-vertical: 7px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
`;

export const ModeButtonText = styled.Text<{ active?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({ active, theme }) =>
    active ? '#FFFFFF' : theme.colors.iconOverlay};
  font-weight: ${({ active }) => (active ? '700' : '500')};
`;

export const TimeStageContainer = styled.View`
  width: 100%;
  min-width: 252px;
  align-items: center;
  justify-content: center;
`;

export const SelectedDateBadge = styled.View`
  padding: 6px 14px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
`;

export const SelectedDateText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const TimeChipsContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const TimeChip = styled(ShrinkableView)<{ selected?: boolean }>`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 8px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.08)'};
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.iconOverlay : 'transparent'};
`;

export const TimeChipText = styled.Text<{ selected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ selected }) => (selected ? '#FFFFFF' : '#A0AAB8')};
  font-weight: 600;
`;

export const RecurrenceSectionContainer = styled.View`
  width: 252px;
  margin-bottom: 4px;
`;

export const RecurrenceToggleButton = styled(ShrinkableView)<{ active?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme, active }) =>
    active ? 'rgba(255, 255, 255, 0.12)' : theme.colors.counterIconBackground};
  border-radius: 10px;
  padding-horizontal: 12px;
  padding-vertical: 7px;
  border-width: 1px;
  border-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'rgba(255, 255, 255, 0.08)'};
`;

export const RecurrenceToggleLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const RecurrenceToggleText = styled.Text<{ active?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({ theme, active }) =>
    active ? theme.colors.text : theme.colors.iconOverlay};
  font-weight: ${({ active }) => (active ? '700' : '500')};
`;

export const RecurrenceToggleValue = styled.Text<{ active?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ active }) => (active ? '#FFFFFF' : '#A0AAB8')};
  font-weight: ${({ active }) => (active ? '700' : '500')};
`;

export const RecurrenceToggleChevron = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-left: 6px;
`;

export const RecurrenceChipsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
  margin-top: 8px;
`;

export const RecurrenceChip = styled(ShrinkableView)<{ selected?: boolean }>`
  padding-horizontal: 9px;
  padding-vertical: 5px;
  border-radius: 8px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: ${({ selected }) =>
    selected ? 'transparent' : 'rgba(255, 255, 255, 0.08)'};
  flex-direction: row;
  align-items: center;
`;

export const RecurrenceChipText = styled.Text<{ selected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 11px;
  color: ${({ selected }) => (selected ? '#FFFFFF' : '#A0AAB8')};
  font-weight: ${({ selected }) => (selected ? '700' : '500')};
`;