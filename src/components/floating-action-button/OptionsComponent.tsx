import React, { useCallback } from 'react';
import FloatingButton from './FloatingButton';
import IconContainer from './IconContainer';
import ZoomIn from './ZoomIn';

const OptionsComponent = ({ handlePress, toastBottomSpan, CurrentIcon, iconRef }) => {
  return (
    <FloatingButton
      onPress={handlePress}
      scaleFactor={0.05}
      extraBottomMargin={toastBottomSpan}
      entering={ZoomIn.delay(2000)}>
      <IconContainer>
        <CurrentIcon ref={iconRef} speed={1.5} size={40} />
      </IconContainer>
    </FloatingButton>
  );
};

export default OptionsComponent;