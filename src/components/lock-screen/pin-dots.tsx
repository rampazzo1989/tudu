import React from 'react';
import { Dot, DotsContainer } from './styles';
import { PinDotsProps } from './types';

export const PinDots: React.FC<PinDotsProps> = ({
  length = 4,
  filledCount,
  isError = false,
}) => {
  const dots = Array.from({ length }, (_, i) => i);

  return (
    <DotsContainer>
      {dots.map(index => {
        const isFilled = index < filledCount;
        return (
          <Dot
            key={index}
            isFilled={isFilled}
            isError={isError}
          />
        );
      })}
    </DotsContainer>
  );
};
