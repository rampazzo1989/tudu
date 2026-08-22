import styled from 'styled-components/native';

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

export const ActionCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`;

export const ActionCardLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const ActionCardIcon = styled.Text`
  font-size: 20px;
  margin-right: 12px;
`;

export const ActionCardTextContainer = styled.View`
  flex: 1;
`;

export const ActionCardTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const ActionCardSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const ActionArrow = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-left: 8px;
`;

export const TimeoutOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const TimeoutChip = styled.TouchableOpacity<{ selected?: boolean }>`
  padding-vertical: 8px;
  padding-horizontal: 14px;
  border-radius: 10px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.counterIconBackground};
  border-width: 1px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.iconOverlay : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
`;

export const TimeoutChipText = styled.Text<{ selected?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({ selected, theme }) => (selected ? '#FFFFFF' : theme.colors.text)};
`;

export const InfoBadge = styled.View`
  flex-direction: row;
  background-color: rgba(121, 86, 191, 0.12);
  border-radius: 10px;
  padding: 12px;
  margin-top: 4px;
  align-items: flex-start;
`;

export const EmojiIcon = styled.Text`
  font-size: 16px;
  margin-right: 8px;
  margin-top: 1px;
`;

export const InfoText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 17px;
  flex: 1;
`;
