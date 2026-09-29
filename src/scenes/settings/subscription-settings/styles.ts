import styled from 'styled-components/native';
import { ShrinkableView } from '../../../components/shrinkable-view';

export const scrollContentContainerStyle = {
  flexGrow: 1,
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 30,
};

export const Container = styled.View`
  width: 100%;
  padding-bottom: 40px;
`;

export const HeroCard = styled.View<{ isPro?: boolean }>`
  width: 100%;
  background-color: ${({ isPro }) =>
    isPro ? 'rgba(34, 43, 62, 0.95)' : 'rgba(45, 36, 70, 0.95)'};
  border-radius: 20px;
  padding: 22px 18px;
  border-width: 1.5px;
  border-color: ${({ isPro, theme }) =>
    isPro ? 'rgba(76, 175, 80, 0.45)' : 'rgba(121, 86, 191, 0.55)'};
  margin-bottom: 24px;
`;

export const HeroHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const HeroBadge = styled.View<{ type?: 'active' | 'trial' | 'free' }>`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${({ type }) => {
    switch (type) {
      case 'active':
        return 'rgba(76, 175, 80, 0.25)';
      case 'trial':
        return 'rgba(245, 158, 11, 0.25)';
      default:
        return 'rgba(245, 158, 11, 0.2)';
    }
  }};
  border-width: 1px;
  border-color: ${({ type }) => {
    switch (type) {
      case 'active':
        return '#81C784';
      case 'trial':
        return '#F59E0B';
      default:
        return '#F59E0B';
    }
  }};
`;

export const HeroBadgeText = styled.Text<{ type?: 'active' | 'trial' | 'free' }>`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ type }) => {
    switch (type) {
      case 'active':
        return '#81C784';
      case 'trial':
        return '#F59E0B';
      default:
        return '#F59E0B';
    }
  }};
`;

export const HeroTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 6px;
`;

export const HeroSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 19px;
  margin-bottom: 14px;
`;

export const PriceRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const PriceValue = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.contrastColor};
`;

export const PriceSubtext = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-left: 6px;
`;

export const StatusDetailBox = styled.View`
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
`;

export const StatusDetailText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 17px;
  flex: 1;
`;

export const SectionContainer = styled.View`
  margin-bottom: 24px;
  width: 100%;
`;

export const SectionTitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

export const BenefitsList = styled.View`
  gap: 10px;
`;

export const BenefitCard = styled.View`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 14px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
`;

export const BenefitIconBox = styled.View`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  margin-right: 14px;
`;

export const BenefitIconText = styled.Text`
  font-size: 20px;
`;

export const BenefitTextContainer = styled.View`
  flex: 1;
`;

export const BenefitTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 2px;
`;

export const BenefitDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const PrimaryActionButton = styled(ShrinkableView)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 12px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 6;
`;

export const PrimaryActionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
`;

export const SecondaryActionButton = styled.TouchableOpacity`
  padding: 12px 16px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.06);
  margin-bottom: 16px;
`;

export const SecondaryActionText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contrastColor};
`;

export const TermsNote = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-align: center;
  line-height: 15px;
  margin-top: 4px;
  padding-horizontal: 8px;
`;

// ==========================================
// [DEV ONLY] Controles de Teste / Sandbox
// ==========================================
export const DevSandboxContainer = styled.View`
  margin-top: 24px;
  padding: 16px;
  background-color: rgba(255, 193, 7, 0.08);
  border-radius: 16px;
  border-width: 1px;
  border-color: rgba(255, 193, 7, 0.35);
  border-style: dashed;
`;

export const DevSandboxHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const DevSandboxTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #ffc107;
`;

export const DevSandboxBadge = styled.Text`
  font-size: 10px;
  font-weight: 800;
  color: #000;
  background-color: #ffc107;
  padding: 2px 6px;
  border-radius: 4px;
  overflow: hidden;
`;

export const DevSandboxDescription = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-bottom: 12px;
`;

export const DevButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
`;

export const DevActionButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  padding: 10px 4px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : 'rgba(255, 255, 255, 0.08)'};
  border-width: 1px;
  border-color: ${({ active }) =>
    active ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
`;

export const DevActionButtonText = styled.Text<{ active?: boolean }>`
  font-size: 11px;
  font-weight: ${({ active }) => (active ? '700' : '500')};
  color: ${({ active, theme }) => (active ? '#ffffff' : theme.colors.contrastColor)};
  text-align: center;
`;
