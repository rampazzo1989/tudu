/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'styled-components/native';
import {CounterTile} from '../../../../components/counter-tile';
import {DEFAULT_PAGE_HORIZONTAL_PADDING} from '../../../../components/page-content/styles';
import {Counter} from '../../types';
import {HorizontalSeparator} from './styles';
import {CounterListProps} from './types';

// const Separator: React.FC = memo(() => {
//   return (
//     <HorizontalSeparator />
//   )
// });

const CountersList: React.FC<CounterListProps> = memo(({list}) => {
  const theme = useTheme();

  const renderItem: ListRenderItem<Counter> = useCallback(
    ({item, index}) => (
      <CounterTile title={item.title} value={item.value} format={item.format} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: Counter, index: number) => `${item.title} ${index}`,
    [],
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: -DEFAULT_PAGE_HORIZONTAL_PADDING,
      }}>
      <FlatList
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
        }}
        contentContainerStyle={{
          paddingHorizontal: DEFAULT_PAGE_HORIZONTAL_PADDING,
        }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={HorizontalSeparator}
      />
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[
          {
            position: 'absolute',
            end: 0,
            width: 20,
            height: '100%',
          },
        ]}
        colors={theme.colors.scrollFadeGradientColors}
        pointerEvents={'none'}
      />
    </View>
  );
});

export {CountersList};
