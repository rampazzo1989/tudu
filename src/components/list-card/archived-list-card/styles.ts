import styled from 'styled-components/native';
import {ShrinkableView} from '../../shrinkable-view';

export const ListCardContainer = styled(ShrinkableView)`
  min-height: 52px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({theme}) => theme.colors.listCard};
  border-radius: 14px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
`;
