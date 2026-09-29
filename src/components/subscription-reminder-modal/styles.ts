import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

export const ModalContainer = styled.View`
  width: 100%;
  max-width: 380px;
  background-color: ${({ theme }) => theme.colors.popupBackground};
  border-radius: 24px;
  padding: 24px 20px 20px 20px;
  border-width: 1.5px;
  border-color: rgba(121, 86, 191, 0.45);
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.55;
  shadow-radius: 20px;
  elevation: 16;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const TrialBadge = styled.View`
  background-color: #f59e0b;
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
`;

export const TrialBadgeText = styled.Text`
  color: #000;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.08);
  justify-content: center;
  align-items: center;
`;

export const CloseButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.iconOverlay};
  font-size: 16px;
  font-weight: 600;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 4px;
`;

export const PriceRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 8px;
`;

export const PriceHighlight = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: #81c784;
`;

export const PriceSubtext = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  margin-left: 6px;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 18px;
  margin-bottom: 16px;
`;

export const FeaturesList = styled.View`
  gap: 10px;
  margin-bottom: 20px;
`;

export const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const FeatureIconBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.07);
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const FeatureIconText = styled.Text`
  font-size: 18px;
`;

export const FeatureTextContainer = styled.View`
  flex: 1;
`;

export const FeatureTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  margin-bottom: 2px;
`;

export const FeatureDescription = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 16px;
`;

export const PrimaryButton = styled(ShrinkableView)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 14px 16px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.35;
  shadow-radius: 8px;
  elevation: 6;
`;

export const PrimaryButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  font-weight: 800;
  color: #fff;
`;

export const SecondaryButton = styled.TouchableOpacity`
  padding: 10px 16px;
  align-items: center;
  justify-content: center;
`;

export const SecondaryButtonText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;
