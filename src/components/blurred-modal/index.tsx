import React, {memo} from 'react';
import {BlurredModalProps} from './types';
import {Blur, ContentContainer, Modal} from './styles';
import { View } from 'react-native';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onRequestClose, children, ...props}) => {
    return (
    <View>
      <Modal {...props} statusBarTranslucent>
        <Blur
          reducedTransparencyFallbackColor="grey"
          overlayColor="#00000020"
          blurType="dark"
          blurAmount={5}>
          <ContentContainer onPress={onRequestClose}>
            {children}
          </ContentContainer>
        </Blur>

      </Modal>
    </View>
    );
  },
);

export {BlurredModal};
