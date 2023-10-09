import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

export const Card = styled(ShrinkableView)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.tuduCard};
  border-radius: 10px;
  min-height: 60px;
  flex-grow: 1;
`;

export const CheckAndTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: 16px;
  margin-top: 12px;
  margin-bottom: 12px;
`;
