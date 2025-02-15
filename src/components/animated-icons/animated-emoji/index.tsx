import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {
  AnimatedIconRef,
  AnimationOptions,
} from '../animated-icon/types';
import { Emoji } from './styles';
import { AnimatedEmojiIconProps } from './types';
import { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const AnimatedEmojiIcon = memo(
  forwardRef<AnimatedIconRef, AnimatedEmojiIconProps>((props, ref) => {
    const scale = useSharedValue(0);
    const rotate = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
            ],
        };
    });

    const play = (options?: AnimationOptions) => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300, velocity: 10 });
        options?.onAnimationFinish?.();
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          play,
          pause() {
            // Do nothing
          },
          toggle() {
            // Do nothing
          },
        };
      },
      [],
    );

    return (
        <Emoji adjustsFontSizeToFit style={animatedStyle}>
            {props.emoji}
        </Emoji>
    );
  }),
);

export {AnimatedEmojiIcon};
