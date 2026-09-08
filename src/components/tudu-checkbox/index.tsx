import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {BaseAnimatedIcon} from '../animated-icons/animated-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {CheckboxCheckedSvg, CheckboxUncheckedSvg} from '../../assets/static/tudu-icons';
import {Touchable} from './styles';
import {TuduCheckboxProps} from './types';

const TuduCheckbox: React.FC<TuduCheckboxProps> = memo(({checked, onPress}) => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePress = useCallback(() => {
    setIsAnimating(true);
    onPress?.();
  }, [onPress]);

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (isAnimating) {
      if (checked) {
        iconRef.current?.play({
          initialFrame: 0,
          finalFrame: 32,
          onAnimationFinish: handleAnimationFinish,
        });
      } else {
        iconRef.current?.play({
          initialFrame: 32,
          finalFrame: 81,
          onAnimationFinish: handleAnimationFinish,
        });
      }
    }
  }, [checked, isAnimating, handleAnimationFinish]);

  return (
    <Touchable onPress={handlePress}>
      {isAnimating ? (
        <BaseAnimatedIcon
          loop={false}
          ref={iconRef}
          source={require('../../assets/lottie/tudu_checkbox.json')}
          componentName="TuduCheckbox"
          staticStateFrame={checked ? 32 : 81}
          initialFrame={0}
          finalFrame={81}
          size={20}
          speed={3}
          onAnimationFinish={handleAnimationFinish}
        />
      ) : checked ? (
        <CheckboxCheckedSvg size={20} color="white" />
      ) : (
        <CheckboxUncheckedSvg size={20} color="white" />
      )}
    </Touchable>
  );
});

export {TuduCheckbox};
