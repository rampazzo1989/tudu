import {StyleSheet} from 'react-native';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../components/page-content/styles';

export const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
    paddingTop: 30,
    paddingBottom: 30,
  },
});
