import React, {memo} from 'react';
import {BlurredModalProps} from './types';
import {Blur, ContentContainer, Modal} from './styles';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onTouchBackground, children, ...props}) => {
    return (
      <Modal {...props} statusBarTranslucent onShow={props.onShow}>
        {/*
          The blur is a sibling of the content, not its parent: on iOS this
          renders as a UIVisualEffectView, and subviews added directly to it are
          subject to the effect — a modal that blurs its own content.
        */}
        <Blur
          reducedTransparencyFallbackColor="grey"
          overlayColor="#00000020"
          blurType="dark"
          blurAmount={5}
        />
        <ContentContainer onPress={onTouchBackground}>
          {children}
        </ContentContainer>
      </Modal>
    );
  },
);

export {BlurredModal};
