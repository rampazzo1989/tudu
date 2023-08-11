import React, {
  forwardRef,
  memo,
  useCallback,
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
import {DeleteIcon} from '../animated-icons/delete-icon';

const FloatingActionButton = memo(
  forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(
    ({DefaultIcon}, ref) => {
      const iconRef = useRef<BaseAnimatedIconRef>(null);
      const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
      const [CurrentIcon, setCurrentIcon] =
        useState<
          React.ForwardRefExoticComponent<
            AnimatedIconProps & React.RefAttributes<BaseAnimatedIconRef>
          >
        >(DefaultIcon);

      const handlePress = useCallback(() => {
        iconRef.current?.toggle();
        setPopoverMenuVisible(true);
      }, []);

      useImperativeHandle(ref, () => ({
        animateThisIcon(Icon) {
          setCurrentIcon(Icon);
          // setTimeout(() => {
          //   iconRef.current?.play();
          // }, 50);
          setTimeout(() => {
            setCurrentIcon(DefaultIcon);
          }, 1500);
        },
      }));

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
            <CurrentIcon autoPlay ref={iconRef} speed={1.4} />
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
          <MenuOptions
            options={[
              {
                Icon: DeleteIcon,
                label: 'OLA',
                onPress: () => console.log('Ola'),
              },
            ]}
          />
        </PopoverMenu>
      );
    },
  ),
);

export {FloatingActionButton};
