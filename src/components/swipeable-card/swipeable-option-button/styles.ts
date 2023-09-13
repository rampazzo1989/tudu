import styled from 'styled-components/native';

type OptionsBackgroundProps = {
  backgroundColor: string;
};

export const Touchable = styled.TouchableOpacity<OptionsBackgroundProps>`
  background-color: ${({backgroundColor}) => backgroundColor};
  justify-content: center;
  align-items: center;
  width: 100px;
  border-radius: 10px;
  height: 100%;
  flex-direction: row;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
`;
