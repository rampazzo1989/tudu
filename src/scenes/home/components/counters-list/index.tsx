import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {FadeIn} from 'react-native-reanimated';
import {CounterTile} from '../../../../components/counter-tile';
import {Counter} from '../../types';
import {Container, HorizontalSeparator, styles} from './styles';
import {CounterListProps} from './types';

const CountersList: React.FC<CounterListProps> = memo(({list, animateIcon}) => {
  const renderItem: ListRenderItem<Counter> = useCallback(
    ({item}) => <CounterTile counterData={item} animateIcon={animateIcon} />,
    [animateIcon],
  );

  const keyExtractor = useCallback(
    (item: Counter, index: number) => `${item.title} ${index}`,
    [],
  );

  return (
    <Container entering={FadeIn}>
      <FlatList
        data={list}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={HorizontalSeparator}
        keyboardShouldPersistTaps="handled"
      />
    </Container>
  );
});

export {CountersList};
