import styled from 'styled-components/native';
import {SectionTitle as Title} from '../../../../components/section-title';

export const Container = styled.View`
  flex: 1;
`;

export const SectionTitle = styled(Title)`
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 16px;
  margin-top: 18px;
`;
