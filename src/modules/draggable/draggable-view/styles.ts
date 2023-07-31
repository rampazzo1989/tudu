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
    backgroundColor: 'rgba(255, 255, 255,0)',
    zIndex: 9990,
  },
  itemDragging: {
    opacity: 0.2,
    backgroundColor: 'transparent',
    zIndex: 9990,
  },
  itemHover: {elevation: 15, zIndex: 9990},
  itemHoverDeleter: {opacity: 0.5, transform: [{scale: 0.9}], zIndex: 9990},
  itemReceiving: {opacity: 0.6},
});
