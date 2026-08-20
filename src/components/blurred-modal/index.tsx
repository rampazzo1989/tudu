import React, {memo} from 'react';
import {BlurredModalProps} from './types';
import {Blur, ContentContainer, Modal} from './styles';
import { View } from 'react-native';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onTouchBackground, children, ...props}) => {
    return (
    <View>
      <Modal {...props} statusBarTranslucent onShow={props.onShow}>
        <Blur
          reducedTransparencyFallbackColor="grey"
          overlayColor="#00000020"
          blurType="dark"
          blurAmount={5}>
          <ContentContainer onPress={onTouchBackground}>
            {children}
          </ContentContainer>
        </Blur>

      </Modal>
    </View>
    );
  },
);

export {BlurredModal};
