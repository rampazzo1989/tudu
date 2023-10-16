import React, {memo, useEffect, useRef, useState} from 'react';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {Touchable} from './styles';
import {TuduCheckboxProps} from './types';

const TuduCheckbox: React.FC<TuduCheckboxProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const [internalCheck, setInternalCheck] = useState(checked);

  useEffect(() => {
    let didntChange = false;
    setInternalCheck(x => {
      didntChange = checked === x;
      return didntChange ? x : checked;
    });

    if (didntChange) {
      return;
    }

    if (checked) {
      iconRef.current?.play({initialFrame: 0, finalFrame: 32});
    } else {
      iconRef.current?.play({initialFrame: 32, finalFrame: 81});
    }
  }, [checked]);

  return (
    <Touchable onPress={onPress}>
      <BaseAnimatedIcon
        loop={false}
        ref={iconRef}
        source={require('../../assets/lottie/tudu_checkbox.json')}
        componentName="TuduCheckbox"
        staticStateFrame={internalCheck ? 32 : 81}
        initialFrame={0}
        finalFrame={81}
        size={20}
        speed={3}
      />
    </Touchable>
  );
});

export {TuduCheckbox};
