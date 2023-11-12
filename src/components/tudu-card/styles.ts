import styled from 'styled-components/native';
import {ShrinkableView} from '../shrinkable-view';

type CheckableComponentType = {done: boolean};

export const Card = styled(ShrinkableView)<CheckableComponentType>`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.tuduCard};
  border-radius: 10px;
  min-height: 60px;
  flex-grow: 1;
  elevation: ${({done}) => (done ? '2' : '0')};
`;

export const CheckAndTextContainer = styled.View<CheckableComponentType>`
  flex-direction: row;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  flex: 1;
  opacity: ${({done}) => (done ? '0.2' : '1')};
`;

export const Label = styled.Text<CheckableComponentType>`
  color: ${({theme}) => theme.colors.text};
  font-size: 16px;
  /* margin-top: 12px; */
  /* margin-bottom: 12px; */
  max-width: 85%;
  flex: 1;
  text-decoration-line: ${({done}) => (done ? 'line-through' : 'none')};
  text-decoration-line: ${({done}) => (done ? 'line-through' : 'none')};
`;

export const LabelAndAdditionalInfoContainer = styled.View`
  flex: 1;
`;

export const AdditionalInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 14px;
`;

export const AdditionalInfoLabel = styled.Text`
  margin-left: 3px;
  font-size: 10px;
`;
