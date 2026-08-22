import styled from "styled-components/native";
import { ShrinkableView } from "../../../../components/shrinkable-view";

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 4px;
  padding-horizontal: 2px;
`;

export const SectionHeaderTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  flex: 1;
`;

export const ToggleButton = styled(ShrinkableView)`
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
  align-items: center;
  justify-content: center;
`;

export const ToggleButtonText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: ${({theme}) => theme.colors.text};
`;

export const OutdatedBanner = styled(ShrinkableView)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  background-color: rgba(245, 180, 4, 0.12);
  border-width: 1px;
  border-color: rgba(245, 180, 4, 0.25);
  margin-bottom: 14px;
`;

export const BannerLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: 8px;
`;

export const BannerTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: #F5B404;
  flex: 1;
`;

export const BannerButton = styled.View`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 8px;
  background-color: rgba(245, 180, 4, 0.22);
  border-width: 1px;
  border-color: rgba(245, 180, 4, 0.35);
  align-items: center;
  justify-content: center;
`;

export const BannerButtonText = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 12px;
  color: #F5B404;
  font-weight: 700;
`;