import React, {memo} from 'react';
import {StyledGradient} from './styles';
import {GradientSeparatorProps} from './types';

const GradientSeparator: React.FC<GradientSeparatorProps> = memo(
  ({colorArray}) => {
    return (
      <StyledGradient
        colors={colorArray}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
      />
    );
  },
);

export {GradientSeparator};
