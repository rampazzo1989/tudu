import React, {memo} from 'react';
import {PopoverMenuProps} from './types';
import Popover from 'react-native-popover-view';
import {styles} from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PopoverMenu: React.FC<PopoverMenuProps> = memo(
  ({children, from, offset, ...props}) => {
    const insets = useSafeAreaInsets();

    return (
      <Popover
        animationType="none"
        animationConfig={{duration: 100}}
        offset={offset}
        backgroundStyle={styles.background}
        popoverStyle={styles.popover}
        from={from}
        displayAreaInsets={insets}
        {...props}>
        {children}
      </Popover>
    );
  },
);

export {PopoverMenu};
