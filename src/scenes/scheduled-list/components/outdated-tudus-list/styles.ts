import styled from "styled-components/native";
import { ShrinkableView } from "../../../../components/shrinkable-view";

export const TitleContainer = styled.View<{isShowingTudus: boolean}>`
  border-width: 1px;
  border-radius: 8px;
  border-color: ${({isShowingTudus, theme}) => isShowingTudus ? theme.colors.sectionTitleBorder : 'rgba(255, 255, 255, 0.5)'};
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding-right: 16px;
  padding-left: 12px;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 16px;
  color: ${({theme}) => theme.colors.text};
  font-weight: 800;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const ControlContainer = styled(ShrinkableView)`
  position: absolute;
  right: 0;
  height: 100%;
  width: 60px;
  align-items: center;
  justify-content: center;
  border-color: white;
  border-radius: 8px;
`;

export const ButtonText = styled.Text`
    font-family: ${({theme}) => theme.fonts.sectionTitle};
    font-size: 12px;
    color: ${({theme}) => theme.colors.text};
    font-weight: 800;
`;