import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TouchableOpacity} from 'react-native';
import {AnimatedIconRef} from '../../animated-icons/animated-icon/types';
import {MenuOptions} from '../../menu-options';
import {PopoverMenu} from '../../popover-menu';
import {Label, Touchable} from './styles';
import {SwipeableOptionProps, SwipeableOptionRef} from './types';

const SwipeableOptionButton = memo(
  forwardRef<SwipeableOptionRef, SwipeableOptionProps>(
    (
      {
        Icon,
        backgroundColor,
        onPress,
        optionSize,
        text,
        progress,
        dragX,
        popoverMenuOptions,
        onPopoverMenuClose,
      },
      ref,
    ) => {
      const iconRef = useRef<AnimatedIconRef>(null);
      const touchableRef = useRef<TouchableOpacity>(null);
      const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);

      useImperativeHandle(ref, () => {
        return {
          playAnimation: () => {
            iconRef.current?.play();
          },
          showPopoverMenu: () => {
            setPopoverMenuVisible(!!popoverMenuOptions);
          },
        };
      });

      const closeMenu = useCallback(() => {
        setPopoverMenuVisible(false);
      }, []);

      return (
        <Touchable
          backgroundColor={backgroundColor}
          onPress={onPress}
          ref={touchableRef}
          size={optionSize}>
          <Icon ref={iconRef} size={24} />
          <Label>{text}</Label>
          {!!popoverMenuOptions && !!touchableRef.current && (
            <PopoverMenu
              isVisible={popoverMenuVisible}
              onRequestClose={closeMenu}
              onCloseComplete={onPopoverMenuClose}
              from={touchableRef}>
              <MenuOptions options={popoverMenuOptions} closeMenu={closeMenu} />
            </PopoverMenu>
          )}
        </Touchable>
      );
    },
  ),
);

export {SwipeableOptionButton};
