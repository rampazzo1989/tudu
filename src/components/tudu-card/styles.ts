import styled from 'styled-components/native';

type CheckableComponentType = {done: boolean};

export const Card = styled.View<CheckableComponentType>`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme, done}) =>
    done ? theme.colors.tuduCardDone : theme.colors.tuduCard};
  border-radius: 12px;
  min-height: 56px;
  flex-grow: 1;
  padding: 10px 12px;
  border-width: 1px;
  border-color: ${({done}) =>
    done ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.06)'};
`;

export const CheckAndTextContainer = styled.View<CheckableComponentType>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: 6px;
  flex: 1;
  opacity: ${({done}) => (done ? '0.35' : '1')};
`;

export const Label = styled.Text<CheckableComponentType>`
  font-family: ${({theme}) => theme.fonts.itemLabel};
  color: ${({theme}) => theme.colors.text};
  font-size: 15px;
  line-height: 20px;
  max-width: 90%;
  text-decoration-line: ${({done}) => (done ? 'line-through' : 'none')};
`;

export const LabelAndAdditionalInfoContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding-right: 6px;
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

export const StarContainer = styled.View`
  width: 28px;
  align-items: center;
  justify-content: center;
`;

