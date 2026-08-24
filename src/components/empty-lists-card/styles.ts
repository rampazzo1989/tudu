import styled from 'styled-components/native';
import { ShrinkableView } from '../shrinkable-view';

export const CardContainer = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.035);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 22px 18px;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

export const IconBadge = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: rgba(121, 86, 191, 0.16);
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.3);
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const IconText = styled.Text`
  font-size: 24px;
`;

export const TitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.contrastColor};
  text-align: center;
  margin-bottom: 6px;
`;

export const SubtitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.iconOverlay};
  text-align: center;
  max-width: 270px;
  margin-bottom: 16px;
`;

export const CreateButton = styled(ShrinkableView)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const CreateButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
`;
