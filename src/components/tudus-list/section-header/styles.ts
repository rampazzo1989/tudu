import styled from 'styled-components/native';
import { ShrinkableView } from '../../shrinkable-view';

export const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 14px;
  margin-bottom: 8px;
  padding-horizontal: 2px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SectionTitleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.sectionTitle};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const CountBadge = styled.View`
  margin-left: 8px;
  padding-vertical: 2px;
  padding-horizontal: 6px;
  border-radius: 6px;
  background-color: rgba(121, 86, 191, 0.18);
`;

export const CountBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const SectionOptionsTouchable = styled(ShrinkableView)`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.04);
`;

export const OptionsIconWrap = styled.View`
  width: 16px;
  height: 16px;
`;
