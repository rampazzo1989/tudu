import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {SectionTitle as Title} from '..//section-title';

export const Container = styled.View`
  flex: 1;
`;

export const SectionTitle = styled(Title)<{marginTop: number}>`
  justify-content: flex-start;
  align-items: center;
  padding-left: 16px;
  margin-top: ${({marginTop}) => marginTop}px;
`;

export const TuduAnimatedContainer = styled(Animated.View)`
  flex-grow: 1;
  width: 100%;
`;

export const InnerContainer = styled.View`
  margin-bottom: 18px;
  margin-top: -6px;
`;
