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
import {FloatingButton, FloatingButtonContainer, IconContainer} from './styles';
import {
  AnimatedIconRef,
  ForwardedRefAnimatedIcon,
} from '../animated-icons/animated-icon/types';
import Animated, {ZoomIn} from 'react-native-reanimated';
import {PopoverMenu} from '../popover-menu';
import {MenuOptions} from '../menu-options';
import {useRecoilValue} from 'recoil';
import {toastSpan} from '../../state/atoms';

const FloatingActionButton = memo(
  forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(
    ({DefaultIcon, animationMode = 'toggle', menuOptions, onPress}, ref) => {
      const iconRef = useRef<AnimatedIconRef>(null);
      const animateNextIcon = useRef(true);
      const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
      const [CurrentIcon, setCurrentIcon] =
        useState<ForwardedRefAnimatedIcon>(DefaultIcon);

      const toastBottomSpan = useRecoilValue(toastSpan);

      // Animates the current icon when option is set
      useEffect(() => {
        if (animateNextIcon.current) {
          iconRef.current?.play({
            onAnimationFinish: () =>
              setTimeout(() => setCurrentIcon(DefaultIcon), 500),
          });
          animateNextIcon.current = false;
        } else {
          iconRef.current?.pause();
        }
      }, [CurrentIcon, DefaultIcon]);

      const handlePress = useCallback(() => {
        if (menuOptions) {
          setPopoverMenuVisible(true);
        } else {
          onPress?.();
        }

        if (animationMode === 'toggle') {
          iconRef.current?.toggle();
        } else {
          iconRef.current?.play();
        }
      }, [animationMode, menuOptions, onPress]);

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
        () => {
          return (
            <FloatingButtonContainer entering={ZoomIn.delay(100)}>
              <FloatingButton
              onPress={handlePress}
              scaleFactor={0.05}
              extraBottomMargin={toastBottomSpan}>
              <IconContainer>
                <CurrentIcon ref={iconRef} speed={1.5} size={40} />
              </IconContainer>
            </FloatingButton>
          </FloatingButtonContainer>
          )
        },
        [CurrentIcon, handlePress, toastBottomSpan],
      );

      return menuOptions ? (
        <PopoverMenu
          isVisible={popoverMenuVisible}
          arrowSize={{width: 0, height: 0}}
          popoverShift={{y: 50}}
          onRequestClose={handlePopoverMenuRequestClose}
          offset={-10}
          from={OptionsComponent}>
          <MenuOptions options={menuOptions} />
        </PopoverMenu>
      ) : (
        <OptionsComponent />
      );
    },
  ),
);

export {FloatingActionButton};
