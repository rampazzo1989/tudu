import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {ListCard} from '../../../../components/list-card';

export const TitleContainer = styled.View`
  width: 260px;
`;
export const ListsContainer = styled.View`
  margin-top: 10px;
  /* margin-bottom: -8px; */
`;

export const Label = styled.Text`
  font-family: ${({theme}) => theme.fonts.default};
  font-size: 12px;
  color: ${({theme}) => theme.colors.text};
  z-index: 10000;
`;

export const TitleInput = styled.TextInput`
  background-color: #fff;
  border-radius: 4px;
  color: #25303d;
  height: 40px;
  padding-left: 10px;
  margin-top: 4px;
`;

export const Lists = styled.ScrollView.attrs({
  contentContainerStyle: {paddingBottom: 2, paddingTop: 8},
  scrollEnabled: true,
})`
  margin-top: 0px;
  max-height: 200px;
  flex-shrink: 1;
  flex-grow: 0;
`;

export const SelectableListCard = styled(ListCard)`
  margin-bottom: 10px;
`;

export const BottomFadingGradient = styled(LinearGradient)`
  position: absolute;
  bottom: 0;
  height: 12px;
  width: 100%;
  z-index: 9999;
`;

export const TopFadingGradient = styled(LinearGradient)`
  position: absolute;
  top: 14px;
  height: 12px;
  width: 100%;
  z-index: 9999;
`;
