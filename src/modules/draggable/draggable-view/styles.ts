import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  itemDragging: {
    opacity: 0.2,
    backgroundColor: 'transparent',
  },
  itemHover: {elevation: 15},
  itemHoverDeleter: {opacity: 0.5, transform: [{scale: 0.9}]},
  itemReceiving: {opacity: 0.6},
});
