import styled from 'styled-components/native';
import {ListCard} from '../../../../components/list-card';

export const ListGroupContainer = styled.View`
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.listCardGroup};
  padding-right: 12px;
  padding-left: 12px;
  padding-top: 8px;
  padding-bottom: 4px;
  width: 100%;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.listCardGroupTitle};
  font-size: 16px;
  line-height: 24px;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: 8px;
`;

export const SubListCard = styled(ListCard)`
  elevation: 15;
  margin-bottom: 8px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const OptionsTouchable = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  align-items: flex-end;
`;

export const OptionsIconContainer = styled.View`
  height: 20px;
  width: 20px;
`;
