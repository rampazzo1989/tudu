import Toast from 'react-native-toast-message';
import {setRecoil} from 'recoil-nexus';
import {toastSpan} from '../../state/atoms';

export const showItemDeletedToast = (
  message: string,
  onUndoPress: () => void,
) => {
  Toast.show({
    type: 'actionSuccessWithUndo',
    position: 'bottom',
    bottomOffset: 60,
    visibilityTime: 60000,
    props: {
      onPress: onUndoPress,
      message,
    },
    onShow: () => setRecoil(toastSpan, 40),
    onHide: () => setRecoil(toastSpan, 0),
  });
};
