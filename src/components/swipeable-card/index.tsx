import React, {memo, useCallback, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {styles} from './styles';
import {SwipeableCardProps} from './types';

const SwipeableCard: React.FC<SwipeableCardProps> = memo(
  ({children, backgroundColor, optionsBackgroundColor, enabled = true}) => {
    const swipeableRef = useRef<Swipeable>(null);

    const renderRightActions = (progress, dragX) => {
      return (
        <TouchableOpacity onPress={() => console.log('delete')}>
          <View
            style={{
              backgroundColor: '#7956BF',
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              borderRadius: 10,
              height: '100%',
            }}>
            <DeleteIcon autoPlay loop />
          </View>
        </TouchableOpacity>
      );
    };

    const renderLeftActions = useCallback((progress, dragX) => {
      return (
        <TouchableOpacity onPress={() => console.log('delete')}>
          <View
            style={{
              backgroundColor: '#7956BF',
              justifyContent: 'center',
              borderRadius: 10,
              alignItems: 'center',
              width: 100,
              height: '100%',
            }}>
            <DeleteIcon autoPlay loop />
          </View>
        </TouchableOpacity>
      );
    }, []);

    const openTime = useRef<NodeJS.Timeout>();

    return (
      <Swipeable
        enabled={enabled}
        ref={swipeableRef}
        friction={3}
        overshootFriction={2}
        onSwipeableOpen={direction => {
          openTime.current = setTimeout(() => {
            clearTimeout(openTime.current);

            openTime.current = undefined;
            swipeableRef.current?.close();
          }, 5000);
        }}
        onSwipeableClose={direction => {
          if (openTime.current) {
            clearTimeout(openTime.current);
          }
        }}
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
