import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {CounterTile} from '../../../../components/counter-tile';
import {Counter} from '../../types';
import {HorizontalList, HorizontalSeparator} from './styles';
import {CounterListProps} from './types';

// const Separator: React.FC = memo(() => {
//   return (
//     <HorizontalSeparator />
//   )
// });

const CountersList: React.FC<CounterListProps> = memo(({list}) => {
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
    <FlatList
      data={list}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{flexGrow: 0}}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={HorizontalSeparator}
    />
  );
});

export {CountersList};
