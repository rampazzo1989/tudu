import Lottie from 'lottie-react-native';
import React, {memo, useEffect, useRef} from 'react';
import {useIdlyAnimatedComponent} from '../../../hooks/useIdlyAnimatedComponent';
import {BaseAnimatedIconProps} from './types';

const BaseAnimatedIcon: React.FC<BaseAnimatedIconProps> = memo(
  ({
    componentName,
    initialFrame,
    finalFrame,
    animateWhenIdle = false,
    ...props
  }) => {
    const animationRef = useRef<Lottie>(null);

    useEffect(() => {
      if (props.autoPlay) {
        console.log('here');
        setTimeout(() => {
          animationRef.current?.play(0, 500);
        }, 500);
      }
    }, [props.autoPlay]);

    useIdlyAnimatedComponent({
      componentRef: animationRef,
      componentName: componentName,
      initialFrame,
      finalFrame,
      shouldAnimate: animateWhenIdle,
    });

    return <Lottie ref={animationRef} loop={false} {...props} />;
  },
);

export {BaseAnimatedIcon};
