import styled from 'styled-components/native';
import {ShrinkableView} from '../../shrinkable-view';

export const ListCardContainer = styled(ShrinkableView)`
  height: 54px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 10px;
`;
