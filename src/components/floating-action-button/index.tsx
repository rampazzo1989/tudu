import React, {memo, useCallback, useRef} from 'react';
import {FloatingActionButtonProps} from './types';
import {PlusIcon} from '../animated-icons/plus-icon';
import {FloatingButton} from './styles';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {FadeIn, ZoomIn} from 'react-native-reanimated';

const FloatingActionButton: React.FC<FloatingActionButtonProps> = memo(() => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);

  const handlePress = useCallback(() => {
    iconRef.current?.play();
  }, []);

  return (
    <FloatingButton
      onPress={handlePress}
      scaleFactor={0.05}
      entering={ZoomIn.delay(500)}>
      <PlusIcon autoPlay ref={iconRef} speed={1.4} />
    </FloatingButton>
  );
});

export {FloatingActionButton};
