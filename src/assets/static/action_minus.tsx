import React, {memo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ActionMinusIcon = memo((props: SvgProps) => {
  return (
    <Svg width={18} height={4} viewBox="0 0 18 4" fill="none" {...props}>
      <Path
        d="M9.311 2.211L5.35 2.17c-4.577-.043-4.577-.298 0-.34l3.868-.043 3.44.043c2.067.014 3.426.085 3.426.17s-1.359.156-3.426.17l-3.44.042"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
  );
});

export {ActionMinusIcon};
