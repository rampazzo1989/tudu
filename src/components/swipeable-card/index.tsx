import React, {memo, useCallback, useRef} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {OptionsContainer, styles} from './styles';
import {SwipeableOptionButton} from './swipeable-option-button';
import {SwipeableCardProps, SwipeableOption} from './types';
import {SwipeableOptionRef} from './swipeable-option-button/types';

const SwipeableCard: React.FC<SwipeableCardProps> = memo(
  ({
    children,
    backgroundColor,
    optionsBackgroundColor,
    leftOptions,
    rightOptions,
    fullWidthOnLeftOptions,
    fullWidthOnRightOptions,
    enabled = true,
  }) => {
    const swipeableRef = useRef<Swipeable>(null);
    const rightIconsRefs = useRef<SwipeableOptionRef[]>([]);
    const leftIconsRefs = useRef<SwipeableOptionRef[]>([]);

    const getOptions = useCallback(
      (
        options: SwipeableOption[],
        fullWidth: boolean,
        iconsRefs: React.MutableRefObject<SwipeableOptionRef[]>,
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
                  ref={ref => {
                    iconsRefs.current.push(ref);
                  }}
                  onPress={option.onPress}
                />
              );
            })}
          </OptionsContainer>
        );
      },
      [optionsBackgroundColor],
    );

    const renderRightActions = useCallback(
      () =>
        rightOptions
          ? getOptions(rightOptions, !!fullWidthOnRightOptions, rightIconsRefs)
          : undefined,
      [fullWidthOnRightOptions, getOptions, rightOptions],
    );

    const renderLeftActions = useCallback(
      () =>
        leftOptions
          ? getOptions(leftOptions, !!fullWidthOnLeftOptions, leftIconsRefs)
          : undefined,
      [fullWidthOnLeftOptions, getOptions, leftOptions],
    );

    // const openTime = useRef<NodeJS.Timeout>();

    const handleSwipeableOpen = useCallback((direction: 'left' | 'right') => {
      const iconsRefs = direction === 'left' ? leftIconsRefs : rightIconsRefs;
      console.log('start open', {direction, iconsRefs});
      for (const ref of iconsRefs.current) {
        ref?.playAnimation?.();
      }
    }, []);

    const handleSwipeableClose = useCallback(() => {}, []);

    return (
      <Swipeable
        enabled={enabled}
        ref={swipeableRef}
        friction={2}
        overshootFriction={2}
        onSwipeableClose={handleSwipeableClose}
        onSwipeableStartReveal={handleSwipeableOpen}
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
);

export {SwipeableCard};
