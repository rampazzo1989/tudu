import styled from 'styled-components/native';

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 24px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 1px;
  flex: 1;
`;

export const RightActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const ControlContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

export const ReactionContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;