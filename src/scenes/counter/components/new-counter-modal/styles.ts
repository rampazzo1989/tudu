import styled from 'styled-components/native';
import {ShrinkableView} from '../../../../components/shrinkable-view';

export const TitleInput = styled.TextInput`
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  margin-top: 4px;
`;

export const ValueInput = styled.TextInput`
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  margin-top: 4px;
`;

export const InputsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 260px;
`;

export const TitleContainer = styled.View`
  width: 60%;
`;

export const ValueContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.text};
`;

export const PaceContainer = styled.View`
  margin-top: 12px;
`;

export const PaceOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

type HighlightableComponent = {highlight?: boolean};

export const PaceOptionButton = styled(ShrinkableView)<HighlightableComponent>`
  padding: 4px;
  min-width: 54px;
  align-items: center;
  border-radius: 6px;
  background-color: ${({theme, highlight}) =>
    highlight ? theme.colors.primary : 'transparent'};
`;

export const PaceOptionLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 18px;
  color: ${({theme}) => theme.colors.text};
`;
