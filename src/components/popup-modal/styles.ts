import styled from 'styled-components/native';

export const PopupContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  min-width: 250px;
  min-height: 150px;
  max-width: 320px;
  background-color: ${({theme}) => theme.colors.popupBackground};
  border-radius: 8px;
  elevation: 15;
  padding: 14px 16px;
`;

export const PopupTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  margin-left: 14px;
  flex-wrap: wrap;
  flex: 1;
`;

export const PopupTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const SeparatorContainer = styled.View`
  height: 1px;
  background-color: white;
  background-image: linear-gradient(to right, #3c414a, #ffffff, #3c414a);
`;

export const ContentContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
