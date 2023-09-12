import {StyleSheet} from 'react-native';
import {CurrentTheme} from '../../themes';

export const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: CurrentTheme.colors.swipeableCard.optionsBackground,
    borderRadius: 10,
    overflow: 'visible',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    backgroundColor: CurrentTheme.colors.swipeableCard.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
});
