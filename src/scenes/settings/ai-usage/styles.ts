import styled from 'styled-components/native';
import {ShrinkableView} from '../../../components/shrinkable-view';

export const Container = styled.View`
  width: 100%;
  padding-bottom: 32px;
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

export const PeriodSelectorRow = styled.View`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;

export const PeriodTab = styled(ShrinkableView)<{isActive?: boolean}>`
  flex: 1;
  padding-vertical: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background-color: ${({isActive, theme}) =>
    isActive ? theme.colors.primary : 'transparent'};
`;

export const PeriodTabText = styled.Text<{isActive?: boolean}>`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({isActive, theme}) =>
    isActive ? '#FFFFFF' : theme.colors.iconOverlay};
`;

export const HeroCard = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.25);
`;

export const HeroCardTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const HeroLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const HeroBadge = styled.View`
  background-color: rgba(121, 86, 191, 0.18);
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 8px;
`;

export const HeroBadgeText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({theme}) => theme.colors.contrastColor};
`;

export const HeroBigValue = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterValue};
  font-size: 36px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 6px;
`;

export const HeroSubvalue = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
`;

export const StatsGrid = styled.View`
  flex-direction: row;
  gap: 12px;
  width: 100%;
  margin-bottom: 20px;
`;

export const StatCard = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.05);
`;

export const StatCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const StatCardIcon = styled.Text`
  font-size: 16px;
  margin-right: 6px;
`;

export const StatCardTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  flex: 1;
`;

export const StatCardValue = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterValue};
  font-size: 20px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 4px;
`;

export const StatCardDesc = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 11px;
  color: ${({theme}) => theme.colors.iconOverlay};
  line-height: 14px;
`;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  width: 100%;
`;

export const BreakdownCard = Card;


export const BreakdownItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 10px;
`;

export const BreakdownItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const BreakdownItemIcon = styled.Text`
  font-size: 22px;
  margin-right: 12px;
`;

export const BreakdownItemTextContainer = styled.View`
  flex: 1;
`;

export const BreakdownItemName = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 2px;
`;

export const BreakdownItemSub = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
`;

export const BreakdownItemRight = styled.View`
  align-items: flex-end;
`;

export const BreakdownItemTokens = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 2px;
`;

export const BreakdownItemRequests = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 11px;
  color: ${({theme}) => theme.colors.iconOverlay};
`;

export const BreakdownSeparator = styled.View`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
  width: 100%;
`;

export const ResetCard = styled.View`
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 16px;
  width: 100%;
`;

export const ResetCardTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 15px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 6px;
`;

export const ResetCardDesc = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  line-height: 16px;
  margin-bottom: 14px;
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

export const LastResetText = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 11px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-align: center;
  margin-top: 10px;
`;

export const EmptyStateCard = styled.View`
  padding: 24px 16px;
  align-items: center;
  justify-content: center;
`;

export const EmptyStateText = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-align: center;
`;
