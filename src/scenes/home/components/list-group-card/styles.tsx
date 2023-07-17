import styled from 'styled-components/native';
import {ListCard} from '../../../../components/list-card';

export const ListGroupContainer = styled.TouchableOpacity`
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
