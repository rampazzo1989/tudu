import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {CounterTile} from '../../../../components/counter-tile';
import {CounterViewModel} from '../../types';
import {Container, HorizontalSeparator, styles} from './styles';
import {CounterListProps} from './types';

const CountersList: React.FC<CounterListProps> = memo(({list, animateIcon}) => {
  const renderItem: ListRenderItem<CounterViewModel> = useCallback(
    ({item}) => <CounterTile counterData={item} animateIcon={animateIcon} />,
    [animateIcon],
  );

  const keyExtractor = useCallback(
    (item: CounterViewModel, index: number) => `${item.title} ${index}`,
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
        keyboardShouldPersistTaps="handled"
      />
    </Container>
  );
});

export {CountersList};
