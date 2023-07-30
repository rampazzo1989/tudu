import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label} from './styles';
import {FloatingDeleteProps} from './types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {DraggableContext} from '../../modules/draggable/draggable-context';

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(({visible}) => {
  const [animate, setAnimate] = useState(false);
  const draggableContext = useContext(DraggableContext);

  const handleItemIsHovering = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      setAnimate(false);
    }
  }, [visible]);

  return visible ? (
    <AnimatedContainer entering={SlideInDown} exiting={SlideOutDown}>
      <Container
        payload={{id: 'delete'}}
        onReceiveDragEnter={handleItemIsHovering}
        onReceiveDragExit={() => setAnimate(false)}
        onReceiveDragDrop={data => {
          const newList = draggableContext?.data?.slice();
          const index = newList?.indexOf(data.dragged.payload);
          newList?.splice(index, 1);
          draggableContext?.setData(newList);
        }}
        receivingStyle={{opacity: 1, transform: [{scale: 1.1}]}}>
        <DeleteIcon loop animate={animate} />
        <Label>Delete</Label>
      </Container>
    </AnimatedContainer>
  ) : (
    <></>
  );
});

export {FloatingDelete};
