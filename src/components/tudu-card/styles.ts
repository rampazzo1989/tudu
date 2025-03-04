import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

type CheckableComponentType = {done: boolean};

export const Card = styled.View<CheckableComponentType>`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.tuduCard};
  border-radius: 10px;
  min-height: 62px;
  flex-grow: 1;
  // border: 1px solid green;
  padding: 8px 0;
`;

export const CheckAndTextContainer = styled.View<CheckableComponentType>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: 5px;
  margin-left: 5px;
  flex: 1;
  opacity: ${({done}) => (done ? '0.2' : '1')};
`;

export const Label = styled.Text<CheckableComponentType>`
  color: ${({theme}) => theme.colors.text};
  font-size: 16px;
  max-width: 85%;
  // flex-grow: 1;
  text-decoration-line: ${({done}) => (done ? 'line-through' : 'none')};
  text-decoration-line: ${({done}) => (done ? 'line-through' : 'none')};
`;

export const LabelAndAdditionalInfoContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const AdditionalInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 14px;
`;

export const AdditionalInfoLabel = styled.Text`
  margin-left: 3px;
  font-size: 10px;
  color: ${({theme}) => theme.colors.text};
`;

export const StarContainer = styled.View`
  width: 10%;
`;
