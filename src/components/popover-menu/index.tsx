import React, {memo} from 'react';
import {PopoverMenuProps} from './types';
import Popover, { PopoverMode } from 'react-native-popover-view';
import {styles} from './styles';

const PopoverMenu: React.FC<PopoverMenuProps> = memo(
  ({children, from, offset, ...props}) => {
    return (
      <Popover
        statusBarTranslucent
        animationType="none"
        animationConfig={{duration: 100}}
        offset={offset}
        backgroundStyle={styles.background}
        popoverStyle={styles.popover}
        debug={true}
        from={from}
        {...props}>
        {children}
      </Popover>
    );
  },
);

export {PopoverMenu};
