import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {CurrentTheme} from '../../themes';

export const styles = StyleSheet.create({
  parent: {
    backgroundColor: CurrentTheme.colors.swipeableCard.optionsBackground,
    borderRadius: 14,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    backgroundColor: CurrentTheme.colors.swipeableCard.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
  },
});

type FullWidthComponent = {fullWidth?: boolean};

export const OptionsContainer = styled.View<FullWidthComponent>`
  flex-direction: row;
  width: ${({fullWidth}) => (fullWidth ? '100%' : 'auto')};
  padding: 0 10px;
`;
