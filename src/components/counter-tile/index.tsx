import React, {memo, useCallback} from 'react';
import {IconContainer, Tile, TileTitleContainer, Title} from './styles';
import {CounterTileProps, TileTitleProps} from './types';

const TileTitle: React.FC<TileTitleProps> = memo(({title}) => {
  return (
    <TileTitleContainer>
      <IconContainer>
        <CounterIcon />
      </IconContainer>
      <Title>{title}</Title>
    </TileTitleContainer>
  );
});

const CounterTile: React.FC<CounterTileProps> = memo(
  ({title, value, format}) => {
    const handleChangeButtonPress = useCallback(() => {
      console.log('handleChangeButtonPress');
    }, []);

    return (
      <Tile>
        <TileTitle title={title} />
        <CounterValue value={value} format={format} />
        <ChangeValueButton onPress={handleChangeButtonPress} />
      </Tile>
    );
  },
);

export {CounterTile};
