import React, {memo} from 'react';
import {BlurredModalProps} from './types';
import {Blur, ContentContainer, Modal} from './styles';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onRequestClose, children, ...props}) => {
    return (
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
    );
  },
);

export {BlurredModal};
