import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const BannerWrapper = styled.View`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const BannerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.listCard};
  border-radius: 16px;
  padding: 16px;
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.35);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const TitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const IconContainer = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(121, 86, 191, 0.2);
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const BannerTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export const DismissButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const DismissButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const BannerMessage = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  line-height: 18px;
  margin-bottom: 14px;
`;

export const ActionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export const SecondaryAction = styled(ShrinkableView)`
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.counterIconBackground};
`;

export const SecondaryActionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconOverlay};
`;

export const PrimaryAction = styled(ShrinkableView)`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const PrimaryActionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
`;
