import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 36px;
  padding-horizontal: 16px;
  width: 100%;
`;

export const CardTouchWrapper = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.035);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 18px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 340px;
`;

export const IconBadge = styled.View`
  width: 58px;
  height: 58px;
  border-radius: 29px;
  background-color: rgba(121, 86, 191, 0.18);
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.35);
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

export const IconText = styled.Text`
  font-size: 28px;
`;

export const TitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  text-align: center;
  margin-bottom: 6px;
`;

export const SubtitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-align: center;
  max-width: 260px;
  margin-bottom: 18px;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const PrimaryAddButton = styled(ShrinkableView)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: 10px;
  padding-horizontal: 18px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const PrimaryAddButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
`;

export const SecondaryAIButton = styled(ShrinkableView)`
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  padding-vertical: 10px;
  padding-horizontal: 14px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const SecondaryAIButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
`;
