import {Dimensions, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  popover: {
    backgroundColor: '#2B3139',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 10, 
    zIndex: 1000,
  },
  background: {
    backgroundColor: "transparent",
    // opacity: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    // zIndex: -1000,
  },
});
