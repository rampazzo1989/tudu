import React, {memo, useCallback, useRef, useState} from 'react';
import {FloatingActionButtonProps} from './types';
import {PlusIcon} from '../animated-icons/plus-icon';
import {FloatingButton} from './styles';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {FadeIn, ZoomIn} from 'react-native-reanimated';
import {PopoverMenu} from '../popover-menu';
import {MenuOptions} from '../menu-options';
import {DeleteIcon} from '../animated-icons/delete-icon';

const FloatingActionButton: React.FC<FloatingActionButtonProps> = memo(() => {
  const iconRef = useRef<BaseAnimatedIconRef>(null);
  const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);

  const handlePress = useCallback(() => {
    iconRef.current?.play();
    setPopoverMenuVisible(true);
  }, []);

  const handlePopoverMenuRequestClose = useCallback(() => {
    iconRef.current?.toggle();
    setPopoverMenuVisible(false);
  }, []);

  const OptionsComponent = useCallback(
    () => (
      <FloatingButton
        onPress={handlePress}
        scaleFactor={0.05}
        entering={ZoomIn.delay(500)}>
        <PlusIcon autoPlay ref={iconRef} speed={1.4} />
      </FloatingButton>
    ),
    [handlePress],
  );

  return (
    <PopoverMenu
      isVisible={popoverMenuVisible}
      arrowSize={{width: 0, height: 0}}
      popoverShift={{y: 50}}
      onRequestClose={handlePopoverMenuRequestClose}
      verticalOffset={-8}
      from={OptionsComponent}>
      <MenuOptions
        options={[
          {Icon: DeleteIcon, label: 'OLA', onPress: () => console.log('Ola')},
        ]}
      />
    </PopoverMenu>
  );
});

export {FloatingActionButton};
