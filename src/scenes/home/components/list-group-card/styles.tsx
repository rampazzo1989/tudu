import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import {ShrinkableView} from '../../../../components/shrinkable-view';
import {EditableListCard} from '../../../../components/list-card/editable-list-card';

export const ListGroupContainer = styled.View`
  border-radius: 16px;
  background-color: ${({theme}) => theme.colors.listCardGroup};
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.08);
  padding-right: 12px;
  padding-left: 12px;
  padding-top: 12px;
  padding-bottom: 6px;
  width: 100%;
  margin-bottom: 8px;
`;

export const Title = styled(Animated.Text)`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  font-size: 13px;
  line-height: 18px;
  color: ${({theme}) => theme.colors.iconOverlay};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  margin-left: 4px;
  flex: 1;
`;

export const SubListCard = styled(EditableListCard)`
  background-color: ${({theme}) => theme.colors.listCardGroupItem};
  border-radius: 12px;
  border-color: rgba(255, 255, 255, 0.04);
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

export const OptionsTouchable = styled(ShrinkableView)`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
`;

export const OptionsIconContainer = styled.View`
  height: 20px;
  width: 20px;
`;

