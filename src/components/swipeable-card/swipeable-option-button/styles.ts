import styled from 'styled-components/native';

type OptionsBackgroundProps = {
  backgroundColor: string;
  size?: number | '100%';
  alignTo: 'left' | 'right';
};

export const Touchable = styled.TouchableOpacity<OptionsBackgroundProps>`
  background-color: ${({backgroundColor}) => backgroundColor};
  justify-content: ${({alignTo}) =>
    alignTo === 'left' ? 'flex-start' : 'flex-end'};
  align-items: center;
  width: ${({size}) => (size === '100%' ? size : size ? `${size}px` : 'auto')};
  border-radius: 10px;
  height: 100%;
  flex-direction: row;
  padding: 0 10px;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: 14px;
  margin-left: 8px;
`;
