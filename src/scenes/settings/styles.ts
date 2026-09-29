import styled from 'styled-components/native';
import {ShrinkableView} from '../../components/shrinkable-view';

export const Container = styled.View`
  width: 100%;
`;

export const SectionContainer = styled.View`
  margin-bottom: 24px;
  width: 100%;
`;

export const SectionTitleText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

export const SettingsCard = styled(ShrinkableView)`
  width: 100%;
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
`;

export const CardLeftContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 10px;
`;

export const IconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const CardTextContainer = styled.View`
  flex: 1;
`;

export const CardTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 16px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 2px;
`;

export const CardSubtitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const StatusBadge = styled.View<{active?: boolean}>`
  padding: 6px 10px;
  border-radius: 10px;
  background-color: ${({active}) =>
    active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled.Text<{active?: boolean}>`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({active}) => (active ? '#81C784' : '#A0AAB8')};
  font-weight: 600;
`;

export const ProSettingsCard = styled(ShrinkableView)<{isPro?: boolean}>`
  width: 100%;
  background-color: ${({isPro}) =>
    isPro ? 'rgba(34, 43, 62, 0.95)' : 'rgba(46, 36, 72, 0.95)'};
  border-radius: 16px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  border-width: 1.5px;
  border-color: ${({isPro}) =>
    isPro ? 'rgba(76, 175, 80, 0.45)' : 'rgba(121, 86, 191, 0.65)'};
  shadow-color: ${({isPro}) => (isPro ? '#4CAF50' : '#7956BF')};
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 4;
`;

export const ProIconContainer = styled.View<{isPro?: boolean}>`
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background-color: ${({isPro}) =>
    isPro ? 'rgba(76, 175, 80, 0.2)' : 'rgba(121, 86, 191, 0.28)'};
  border-width: 1px;
  border-color: ${({isPro}) =>
    isPro ? 'rgba(76, 175, 80, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const ProBadge = styled.View<{type?: 'active' | 'trial' | 'free'}>`
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${({type}) => {
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
  border-color: ${({type}) => {
    switch (type) {
      case 'active':
        return '#81C784';
      case 'trial':
        return '#F59E0B';
      default:
        return '#F59E0B';
    }
  }};
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const ProBadgeText = styled.Text<{type?: 'active' | 'trial' | 'free'}>`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({type}) => {
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

export const ProChevron = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.iconOverlay};
  margin-left: 8px;
`;
