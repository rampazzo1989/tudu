import React, {memo} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {BlurredModalProps} from './types';
import {BlurView} from '@react-native-community/blur';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onRequestClose, children, ...props}) => {
    return (
      <Modal {...props} statusBarTranslucent style={{flex: 1}}>
        <BlurView
          style={{
            flex: 1,
          }}
          reducedTransparencyFallbackColor="grey"
          overlayColor="#00000020"
          blurType="dark"
          blurAmount={5}>
          <TouchableOpacity
            onPress={onRequestClose}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {children}
          </TouchableOpacity>
        </BlurView>
      </Modal>
    );
  },
);

export {BlurredModal};
