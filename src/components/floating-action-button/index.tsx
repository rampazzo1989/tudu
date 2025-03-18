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
import { useOneTimeAnimationControl } from '../../hooks/useOneTimeAnimationControl';
import { AnimatedEmojiIcon } from '../animated-icons/animated-emoji';
import { ForwardedRefAnimatedEmojiIcon } from '../animated-icons/animated-emoji/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const ANIMATED_REACTION_DURATION = 1500;

const FloatingActionButton = memo(
  forwardRef<FloatingActionButtonRef, FloatingActionButtonProps>(
    ({DefaultIcon, animationMode = 'toggle', menuOptions, animateOnPress, onPress}, ref) => {
      const iconRef = useRef<AnimatedIconRef>(null);
      const animateNextIcon = useRef(true);
      const [popoverMenuVisible, setPopoverMenuVisible] = useState(false);
      const [CurrentIcon, setCurrentIcon] =
        useState<ForwardedRefAnimatedIcon | ForwardedRefAnimatedEmojiIcon>(DefaultIcon);
      const {animateOnceOnly} = useOneTimeAnimationControl();
      const [emoji, setEmoji] = useState<string>();
      const reactionTimeoutRef = useRef<NodeJS.Timeout>();

      const toastBottomSpan = useRecoilValue(toastSpan);

      
      const insets = useSafeAreaInsets();

      // Animates the current icon when option is set
      useEffect(() => {
        console.log('Safe area insets:', insets, {toastBottomSpan});

        if (animateNextIcon.current) {
          iconRef.current?.play({
            onAnimationFinish: () => {
              reactionTimeoutRef.current = setTimeout(() => {
                setCurrentIcon(DefaultIcon);
                reactionTimeoutRef.current = undefined;
              }, ANIMATED_REACTION_DURATION);
            }
          });
          animateNextIcon.current = false;
        } else {
          iconRef.current?.pause();
        }
      }, [CurrentIcon]);

      const handlePress = useCallback(() => {
        if (menuOptions) {
          setPopoverMenuVisible(true);
        } else {
          onPress?.();
        }

        if (!animateOnPress) {
          return;
        }

        if (animationMode === 'toggle') {
          iconRef.current?.toggle();
        } else {
          iconRef.current?.play();
        }
      }, [animationMode, menuOptions, onPress, animateOnPress]);

      const handlePopoverMenuRequestClose = useCallback(() => {
        if (animationMode === 'toggle') {
          iconRef.current?.toggle();
        }
        setPopoverMenuVisible(false);
      }, [animationMode]);

      useImperativeHandle(ref, () => ({
        animateThisIcon(Icon) {
          if (reactionTimeoutRef.current) {
            return;
          } 

          animateNextIcon.current = true;

          // Emoji
          if (typeof Icon === 'string') {
            setEmoji(Icon);
            setCurrentIcon(AnimatedEmojiIcon);
          } else {
            setCurrentIcon(Icon);
          }
        },
        closeMenu: handlePopoverMenuRequestClose,
      }));

      const OptionsComponent = useCallback(
        () => {
          return (
            <FloatingButtonContainer entering={animateOnceOnly(ZoomIn.delay(100))} extraBottomMargin={toastBottomSpan}>
              <FloatingButton
                onPress={handlePress}
                scaleFactor={0.05}>
              <IconContainer>
                <CurrentIcon emoji={emoji ?? ''} ref={iconRef} speed={1.5} size={40} />
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
