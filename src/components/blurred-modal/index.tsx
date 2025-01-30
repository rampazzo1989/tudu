import React, {memo} from 'react';
import {BlurredModalProps} from './types';
import {Blur, ContentContainer, Modal} from './styles';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const BlurredModal: React.FC<BlurredModalProps> = memo(
  ({onRequestClose, children, ...props}) => {
    return (
      // <SafeAreaProvider>
  //       <SafeAreaView style={{
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }}>
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
      // </SafeAreaView>
      // </SafeAreaProvider>
    );
  },
);

export {BlurredModal};
