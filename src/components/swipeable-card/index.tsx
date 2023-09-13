import React, {memo, useCallback, useRef} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {OptionsContainer, styles} from './styles';
import {SwipeableOptionButton} from './swipeable-option-button';
import {SwipeableCardProps, SwipeableOption} from './types';

const TIME_TO_CLOSE_OPTIONS = 5000;

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

    const getOptions = useCallback(
      (options: SwipeableOption[], fullWidth: boolean) => {
        return (
          <OptionsContainer fullWidth={fullWidth}>
            {options.map(option => {
              return (
                <SwipeableOptionButton
                  Icon={option.Icon}
                  text={option.text}
                  backgroundColor={
                    option.backgroundColor ?? optionsBackgroundColor
                  }
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
          ? getOptions(rightOptions, !!fullWidthOnRightOptions)
          : undefined,
      [fullWidthOnRightOptions, getOptions, rightOptions],
    );

    const renderLeftActions = useCallback(
      () =>
        leftOptions
          ? getOptions(leftOptions, !!fullWidthOnLeftOptions)
          : undefined,
      [fullWidthOnLeftOptions, getOptions, leftOptions],
    );

    const openTime = useRef<NodeJS.Timeout>();

    const handleSwipeableOpen = useCallback(() => {
      openTime.current = setTimeout(() => {
        clearTimeout(openTime.current);

        openTime.current = undefined;
        swipeableRef.current?.close();
      }, TIME_TO_CLOSE_OPTIONS);
    }, []);

    const handleSwipeableClose = useCallback(() => {
      if (openTime.current) {
        clearTimeout(openTime.current);
      }
    }, []);

    return (
      <Swipeable
        enabled={enabled}
        ref={swipeableRef}
        friction={3}
        overshootFriction={2}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableClose={handleSwipeableClose}
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
