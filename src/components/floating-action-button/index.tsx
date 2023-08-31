import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {FloatingActionButtonProps, FloatingActionButtonRef} from './types';
import {FloatingButton} from './styles';
import {
  AnimatedIconProps,
  BaseAnimatedIconRef,
} from '../animated-icons/animated-icon/types';
import {ZoomIn} from 'react-native-reanimated';
import {PopoverMenu} from '../popover-menu';
import {MenuOptions} from '../menu-options';

const FloatingActionButton = memo(
  forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(
    ({DefaultIcon, menuOptions, animationMode = 'toggle'}, ref) => {
      const iconRef = useRef<BaseAnimatedIconRef>(null);
      const animateNextIcon = useRef(true);
      const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
      const [CurrentIcon, setCurrentIcon] =
        useState<
          React.ForwardRefExoticComponent<
            AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
          >
        >(DefaultIcon);

      // Animates the current icon when option is set
      useEffect(() => {
        if (animateNextIcon.current) {
          iconRef.current?.play(() =>
            setTimeout(() => setCurrentIcon(DefaultIcon), 500),
          );
          animateNextIcon.current = false;
        } else {
          iconRef.current?.pause();
        }
      }, [CurrentIcon, DefaultIcon]);

      const handlePress = useCallback(() => {
        if (animationMode === 'toggle') {
          iconRef.current?.toggle();
        } else {
          iconRef.current?.play();
        }
        setPopoverMenuVisible(true);
      }, [animationMode]);

      const handlePopoverMenuRequestClose = useCallback(() => {
        if (animationMode === 'toggle') {
          iconRef.current?.toggle();
        }
        setPopoverMenuVisible(false);
      }, [animationMode]);

      useImperativeHandle(ref, () => ({
        animateThisIcon(Icon) {
          animateNextIcon.current = true;
          setCurrentIcon(Icon);
        },
        closeMenu: handlePopoverMenuRequestClose,
      }));

      const OptionsComponent = useCallback(
        () => (
          <FloatingButton
            onPress={handlePress}
            scaleFactor={0.05}
            entering={ZoomIn.delay(100)}>
            <CurrentIcon ref={iconRef} speed={1.4} />
          </FloatingButton>
        ),
        [CurrentIcon, handlePress],
      );

      return (
        <PopoverMenu
          isVisible={popoverMenuVisible}
          arrowSize={{width: 0, height: 0}}
          popoverShift={{y: 50}}
          onRequestClose={handlePopoverMenuRequestClose}
          verticalOffset={-8}
          from={OptionsComponent}>
          <MenuOptions options={menuOptions} />
        </PopoverMenu>
      );
    },
  ),
);

export {FloatingActionButton};
