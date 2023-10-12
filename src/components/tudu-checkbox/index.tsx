import React, {memo, useEffect, useRef} from 'react';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {Touchable} from './styles';
import {TuduCheckboxProps} from './types';

const TuduCheckbox: React.FC<TuduCheckboxProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);

  useEffect(() => {
    if (checked) {
      iconRef.current?.play({initialFrame: 0, finalFrame: 32});
    } else {
      iconRef.current?.play({initialFrame: 38, finalFrame: 81});
    }
  }, [checked]);

  return (
    <Touchable onPress={onPress}>
      <BaseAnimatedIcon
        loop={false}
        ref={iconRef}
        source={require('../../assets/lottie/tudu_checkbox.json')}
        componentName="TuduCheckbox"
        staticStateFrame={0}
        initialFrame={0}
        finalFrame={81}
        size={20}
        speed={3}
      />
    </Touchable>
  );
});

export {TuduCheckbox};
