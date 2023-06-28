import React, {memo} from 'react';
import {FadingViewProps} from './types';
import Animated, {
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';

const FadingView: React.FC<FadingViewProps> = memo(
  ({visible, children, style}) => {
    return (
      <>
        {visible ? (
          <Animated.View
            entering={FadeInUp.duration(100)}
            exiting={FadeOutUp.duration(100)}
            style={style}>
            {children}
          </Animated.View>
        ) : undefined}
      </>
    );
  },
);

export {FadingView};
