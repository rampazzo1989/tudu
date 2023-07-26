import React, {memo} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label} from './styles';
import {FloatingDeleteProps} from './types';

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(({visible}) => {
  return visible ? (
    <AnimatedContainer entering={SlideInDown} exiting={SlideOutDown}>
      <Container
        onReceiveDragEnter={() => console.log('ENTERR')}
        receivingStyle={{opacity: 1}}>
        <DeleteIcon loop autoPlay />
        <Label>Delete</Label>
      </Container>
    </AnimatedContainer>
  ) : (
    <></>
  );
});

export {FloatingDelete};
