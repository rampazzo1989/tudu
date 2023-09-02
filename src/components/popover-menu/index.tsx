import React, {memo} from 'react';
import {PopoverMenuProps} from './types';
import Popover from 'react-native-popover-view';
import {styles} from './styles';

const PopoverMenu: React.FC<PopoverMenuProps> = memo(
  ({children, from, verticalOffset, ...props}) => {
    return (
      <Popover
        statusBarTranslucent
        animationType="none"
        animationConfig={{duration: 100}}
        verticalOffset={verticalOffset}
        backgroundStyle={styles.background}
        popoverStyle={styles.popover}
        from={from}
        {...props}>
        {children}
      </Popover>
    );
  },
);

export {PopoverMenu};
