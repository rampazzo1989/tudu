import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseToast, BaseToastProps} from 'react-native-toast-message';
import {CurrentTheme} from '../../themes';

const styles = StyleSheet.create({
  toastStyle: {
    borderLeftColor: CurrentTheme.colors.defaultToast.borderLeft,
    backgroundColor: CurrentTheme.colors.defaultToast.background,
  },
  contentContainerStyle: {paddingHorizontal: 15},
  text1Style: {
    fontSize: 15,
    fontWeight: '400',
    color: CurrentTheme.colors.defaultToast.text,
  },
});

const toastConfig = {
  tuduWarning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.toastStyle}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={styles.text1Style}
    />
  ),
};

export {toastConfig};
