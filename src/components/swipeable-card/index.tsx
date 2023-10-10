import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {OptionsContainer, styles} from './styles';
import {SwipeableOptionButton} from './swipeable-option-button';
import {SwipeableCardProps, SwipeableCardRef, SwipeableOption} from './types';
import {SwipeableOptionRef} from './swipeable-option-button/types';
import {getLastItem} from '../../utils/array-utils';
import {useControlSwipeableState} from '../../hooks/useControlSwipeableState';

const SwipeableCard = memo(
  forwardRef<SwipeableCardRef, SwipeableCardProps>(
    (
      {
        children,
        backgroundColor,
        optionsBackgroundColor,
        leftOptions,
        rightOptions,
        fullWidthOnLeftOptions,
        fullWidthOnRightOptions,
        onSwipeLeft,
        onSwipeRight,
        optionsSize = 'medium',
        enabled = true,
      },
      ref,
    ) => {
      const swipeableRef = useRef<Swipeable>(null);
      const rightIconsRefs = useRef<SwipeableOptionRef[]>([]);
      const leftIconsRefs = useRef<SwipeableOptionRef[]>([]);

      const {setOpenSwipeable} = useControlSwipeableState(swipeableRef);

      const handleOptionMenuClose = useCallback(() => {
        swipeableRef.current?.close();
      }, []);

      useImperativeHandle(ref, () => ({
        closeOptions: () => swipeableRef.current?.close(),
      }));

      const getOptions = useCallback(
        (
          options: SwipeableOption[],
          fullWidth: boolean,
          iconsRefs: React.MutableRefObject<SwipeableOptionRef[]>,
          alignTo: 'left' | 'right',
        ) => {
          iconsRefs.current = [];
          return (
            <OptionsContainer fullWidth={fullWidth}>
              {options.map((option, index) => {
                return (
                  <SwipeableOptionButton
                    Icon={option.Icon}
                    key={`${option.text}${index}`}
                    text={option.text}
                    backgroundColor={
                      option.backgroundColor ?? optionsBackgroundColor
                    }
                    optionWidth={fullWidth ? '100%' : undefined}
                    optionSize={optionsSize}
                    ref={r => {
                      if (r) {
                        iconsRefs.current.push(r);
                      }
                    }}
                    onPress={option.onPress}
                    popoverMenuOptions={option.popoverMenuOptions}
                    onPopoverMenuClose={handleOptionMenuClose}
                    alignTo={alignTo}
                  />
                );
              })}
            </OptionsContainer>
          );
        },
        [handleOptionMenuClose, optionsBackgroundColor, optionsSize],
      );

      const renderRightActions = useCallback(
        () =>
          rightOptions
            ? getOptions(
                rightOptions,
                !!fullWidthOnRightOptions,
                rightIconsRefs,
                'right',
              )
            : undefined,
        [fullWidthOnRightOptions, getOptions, rightOptions],
      );

      const renderLeftActions = useCallback(
        () =>
          leftOptions
            ? getOptions(
                leftOptions,
                !!fullWidthOnLeftOptions,
                leftIconsRefs,
                'left',
              )
            : undefined,
        [fullWidthOnLeftOptions, getOptions, leftOptions],
      );

      const handleSwipeableStartDrag = useCallback(
        (direction: 'left' | 'right') => {
          const iconsRefs =
            direction === 'left' ? leftIconsRefs : rightIconsRefs;

          const lastIcon = getLastItem(iconsRefs.current);
          lastIcon?.playAnimation?.();
        },
        [],
      );

      const handleSwipeableWillOpen = useCallback(
        (direction: 'left' | 'right') => {
          setTimeout(() => {
            direction === 'left' ? onSwipeRight?.() : onSwipeLeft?.();
            const iconsRefs =
              direction === 'left' ? leftIconsRefs : rightIconsRefs;
            for (const iconRef of iconsRefs.current) {
              iconRef?.showPopoverMenu?.();
            }
          }, 50);
        },
        [onSwipeLeft, onSwipeRight],
      );

      const handleSwipeableOpen = useCallback(() => {
        setOpenSwipeable();
      }, [setOpenSwipeable]);

      const handleSwipeableClose = useCallback(() => {}, []);

      return (
        <Swipeable
          enabled={enabled}
          ref={swipeableRef}
          friction={2}
          overshootFriction={2}
          onSwipeableWillOpen={handleSwipeableWillOpen}
          onSwipeableOpen={handleSwipeableOpen}
          onSwipeableClose={handleSwipeableClose}
          onSwipeableOpenStartDrag={handleSwipeableStartDrag}
          leftThreshold={90}
          containerStyle={[
            styles.parent,
            {backgroundColor: optionsBackgroundColor},
          ]}
          childrenContainerStyle={[styles.contentContainer, {backgroundColor}]}
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions}>
          {children}
        </Swipeable>
      );
    },
  ),
);

export {SwipeableCard};
