import styled from 'styled-components/native';

export const Tile = styled.View`
  height: 100px;
  width: 114px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.counterTile};
`;

export const TileTitleContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const IconContainer = styled.View`
  height: 26px;
  width: 26px;
  border-radius: 13px;
  background-color: ${({theme}) => theme.colors.counterIconBackground});
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterTitle};
  font-size: 11px;
  line-height: 13px;
`;
