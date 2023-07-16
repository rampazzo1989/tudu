import React, {memo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ActionPlusIcon = memo((props: SvgProps) => {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M8.818 5.345l-.044 3.443-3.425.042c-4.577.043-4.577.298 0 .34l3.425.043.044 3.428c.045 4.59.31 4.59.355 0l.044-3.428 3.44-.043c2.067-.014 3.426-.085 3.426-.17s-1.359-.156-3.426-.17l-3.44-.042-.044-3.443c-.015-2.082-.089-3.428-.177-3.428-.089 0-.163 1.346-.178 3.428z"
        fill="#000"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
  );
});

export {ActionPlusIcon};
