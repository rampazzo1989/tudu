import styled from 'styled-components/native';
import {ListCard} from '../../../../components/list-card';

export const StyledListCard = styled(ListCard)`
  margin-bottom: ${({isHighlighted}) => (isHighlighted ? '10px' : '8px')};
`;
