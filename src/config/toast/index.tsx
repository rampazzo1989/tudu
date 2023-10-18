import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  BaseToast,
  BaseToastProps,
  ToastShowParams,
} from 'react-native-toast-message';
import {CurrentTheme} from '../../themes';
import {t} from 'i18next';

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
  actionSuccessStyle: {
    width: '90%',
    marginHorizontal: 20,
    borderRadius: 6,
    borderLeftColor: CurrentTheme.colors.defaultToast.borderLeft,
    backgroundColor: CurrentTheme.colors.actionMessageToast.background,
    padding: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  actionSuccessWithUndo: ({props}: ToastShowParams) => (
    // <View style={{width: '90%', alignItems: 'flex-start'}}>
    <View style={styles.actionSuccessStyle}>
      <Text style={styles.text1Style}>{props.message}</Text>
      <TouchableOpacity onPress={props.onPress} hitSlop={20}>
        <Text style={styles.text1Style}>{t('toast.undo')}</Text>
      </TouchableOpacity>
    </View>
    // </View>
  ),
};

export {toastConfig};
