import styled from 'styled-components/native';
import { OptionButton } from '../option-button';
import { ShrinkableView } from '../shrinkable-view';

export const OptionsContainer = styled.View`
  flex-shrink: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
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