import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {Counter} from '../../types';

export const HorizontalSeparator = styled.View`
  height: 100%;
  width: 12px;
`;

export const HorizontalList = styled(FlatList as new () => FlatList<Counter>)`
  height: 100px;
`;
