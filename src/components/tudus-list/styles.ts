import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {SectionTitle as Title} from '..//section-title';
import { ShrinkableView } from '../shrinkable-view';

export const Container = styled.View`
  flex: 1;
  overflow: hidden;
  padding: 0 16px;
  // margin-top: -30px;
  margin-bottom: -30px;
`;

export const SectionTitle = styled(Title)<{marginTop: number}>`
  justify-content: flex-start;
  align-items: center;
  padding-left: 16px;
  margin-top: ${({marginTop}) => marginTop}px;
`;

export const TuduAnimatedWrapper = styled(Animated.View)`
`;

export const TuduAnimatedContainer = styled.View`
  flex-grow: 1;
  width: 100%;
`;

export const DoneTuduAnimatedContainer = styled.View`
  flex-grow: 1;
  width: 100%;
  background-color: ${({theme}) => theme.colors.tuduCardDone};
  margin-top: 12px;
  border-radius: 10px;
`;

export const InnerContainer = styled.View`
  margin-bottom: 18px;
  margin-top: -6px;
`;
export const OptionsTouchable = styled(ShrinkableView)`
  width: 28px;
  height: 28px;
  align-items: flex-end;
  justify-content: center;
  align-items: center;
`;

export const OptionsIconContainer = styled.View`
  height: 20px;
  width: 20px;
`;
