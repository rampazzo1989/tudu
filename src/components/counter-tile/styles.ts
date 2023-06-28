import styled from 'styled-components/native';
import {FadingView} from '../fading-view';

export const Tile = styled.View`
  height: 100px;
  width: 114px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.counterTile};
  padding: 8px;
  align-items: center;
  justify-content: space-between;
`;

export const TileTitleContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const IconContainer = styled.View`
  height: 26px;
  width: 26px;
  border-radius: 13px;
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterTitle};
  font-size: 11px;
  line-height: 13px;
  margin-left: 6px;
  flex: 1;
  flex-wrap: wrap;
`;

export const CounterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterValue};
  font-size: 32px;
  color: ${({theme}) => theme.colors.text};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  position: absolute;
  bottom: 0;
`;

export const Button = styled.TouchableOpacity`
  height: 14px;
  width: 26px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

export const ReplacebleContainer = styled(FadingView)`
  border: 1px solid blue;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding-bottom: 6px;
`;

export const EditingContainer = styled(FadingView)`
  border: 1px solid red;
  flex: 1;
`;
