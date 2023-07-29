import React, {memo, useCallback} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label} from './styles';
import {FloatingDeleteProps} from './types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(({visible}) => {
  const handleItemIsHovering = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
  }, []);
  return visible ? (
    <AnimatedContainer entering={SlideInDown} exiting={SlideOutDown}>
      <Container
        payload={{id: 'delete'}}
        onReceiveDragEnter={handleItemIsHovering}
        style={{zIndex: 9999999}}
        receivingStyle={{opacity: 1, transform: [{scale: 1.1}]}}>
        <DeleteIcon loop />
        <Label>Delete</Label>
      </Container>
    </AnimatedContainer>
  ) : (
    <></>
  );
});

export {FloatingDelete};
