import React, { memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { AnimatedIconProps } from '../animated-icon/types';

const ShareIcon: React.FC<AnimatedIconProps> = memo(({ size = 16, style }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}>
      <Path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export { ShareIcon };
