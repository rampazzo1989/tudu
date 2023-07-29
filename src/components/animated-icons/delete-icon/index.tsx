import React, {memo, useEffect, useRef} from 'react';
import {BaseAnimatedIconRef} from '../animated-icon/types';
import {AnimatedIcon} from './styles';
import {DeleteIconProps} from './types';

const DeleteIcon: React.FC<DeleteIconProps> = memo(props => {
  const ref = useRef<BaseAnimatedIconRef>(null);

  useEffect(() => {
    if (props.animate) {
      ref.current?.play();
    }
  }, [props.animate]);

  return (
    <AnimatedIcon
      source={require('../../../assets/lottie/trash.json')}
      loop={false}
      componentName="DeleteIcon"
      animateWhenIdle
      ref={ref}
      {...props}
    />
  );
});

export {DeleteIcon};
