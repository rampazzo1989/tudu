import React, {memo} from 'react';
import Svg, {Rect, Path, SvgProps} from 'react-native-svg';

const AppIcon: React.FC<SvgProps> = memo(props => {
  return (
    <Svg width={65} height={65} viewBox="0 0 65 65" fill="none" {...props}>
      <Rect width={65} height={65} rx={32.5} fill="#B2A0D9" />
      <Rect x={7} y={7} width={51} height={51} rx={25.5} fill="#6B49B7" />
      <Path
        d="M48 25L29.25 43 18 32.2"
        stroke="#fff"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export {AppIcon};
