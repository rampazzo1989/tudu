import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import {FadingView} from '../fading-view';
import {ShrinkableView} from '../shrinkable-view';

export const Tile = styled.View`
  height: 104px;
  width: 118px;
  border-radius: 14px;
  background-color: ${({theme}) => theme.colors.counterTile};
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.06);
  padding: 10px;
  align-items: center;
  justify-content: space-between;
`;

export const TileTitleContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const IconContainer = styled.View`
  height: 24px;
  width: 24px;
  border-radius: 7px;
  background-color: ${({theme}) => theme.colors.counterIconBackground};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.sectionTitle};
  color: ${({theme}) => theme.colors.text};
  font-size: 11px;
  line-height: 14px;
  margin-left: 6px;
  flex: 1;
  flex-wrap: wrap;
`;

export const CounterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterValue};
  font-size: 30px;
  color: ${({theme}) => theme.colors.text};
  font-weight: 700;
`;

export const EditingCounterText = styled.Text`
  font-family: ${({theme}) => theme.fonts.counterValue};
  font-size: 22px;
  color: ${({theme}) => theme.colors.text};
  font-weight: 700;
`;

export const ButtonContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export const Button = styled.View`
  height: 12px;
  width: 24px;
  background-color: rgba(121, 86, 191, 0.25);
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(121, 86, 191, 0.4);
`;

export const ReplacebleContainer = styled(FadingView)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const ShrinkableContainer = styled(ShrinkableView)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const EditingContainer = styled(FadingView)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const ActionButtonContainer = styled(ShrinkableView).attrs({
  scaleFactor: 0.08,
})`
  height: 30px;
  width: 30px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 9px;
  justify-content: center;
  align-items: center;
`;

export const ActionButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const OptionsTouchable = styled(ShrinkableView)`
  width: 28px;
  height: 18px;
  align-items: flex-end;
`;

export const OptionsIconContainer = styled.View`
  height: 20px;
  width: 20px;
`;

export const EditingTextContainer = styled(ShrinkableView)``;

