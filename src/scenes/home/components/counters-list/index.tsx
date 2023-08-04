import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {useTheme} from 'styled-components/native';
import {CounterTile} from '../../../../components/counter-tile';
import {Counter} from '../../types';
import {
  Container,
  HorizontalSeparator,
  LateralFadingGradient,
  LeftFadingGradient,
  RightFadingGradient,
  styles,
} from './styles';
import {CounterListProps} from './types';

const CountersList: React.FC<CounterListProps> = memo(({list}) => {
  const theme = useTheme();

  const renderItem: ListRenderItem<Counter> = useCallback(
    ({item}) => (
      <CounterTile title={item.title} value={item.value} format={item.format} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: Counter, index: number) => `${item.title} ${index}`,
    [],
  );

  return (
    <Container>
      <FlatList
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={HorizontalSeparator}
      />
      <LeftFadingGradient
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        colors={theme.colors.scrollFadeGradientColors}
        pointerEvents={'none'}
      />
      <RightFadingGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={theme.colors.scrollFadeGradientColors}
        pointerEvents={'none'}
      />
    </Container>
  );
});

export {CountersList};
