import Toast from 'react-native-toast-message';

export const showItemDeletedToast = (
  message: string,
  onUndoPress: () => void,
) => {
  Toast.show({
    type: 'actionSuccessWithUndo',
    position: 'bottom',
    bottomOffset: 60,
    visibilityTime: 7000,
    props: {
      onPress: onUndoPress,
      message,
    },
  });
};
