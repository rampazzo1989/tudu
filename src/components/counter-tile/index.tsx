import React, {memo, useCallback} from 'react';
import {AdjustIcon} from '../animated-icons/adjust-icon';
import {HashIcon} from '../animated-icons/hash-icon';
import {
  ButtonContainer,
  ChangeValueButton,
  CounterText,
  IconContainer,
  Tile,
  TileTitleContainer,
  Title,
} from './styles';
import {CounterTileProps, CounterValueProps, TileTitleProps} from './types';

const TileTitle: React.FC<TileTitleProps> = memo(({title}) => {
  return (
    <TileTitleContainer>
      <IconContainer>
        <HashIcon />
      </IconContainer>
      <Title>{title}</Title>
    </TileTitleContainer>
  );
});

const CounterValue: React.FC<CounterValueProps> = memo(({value, format}) => {
  return (
    <CounterText adjustsFontSizeToFit numberOfLines={1}>
      {value}
    </CounterText>
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
        <ButtonContainer>
          <ChangeValueButton onPress={handleChangeButtonPress}>
            <AdjustIcon />
          </ChangeValueButton>
        </ButtonContainer>
      </Tile>
    );
  },
);

export {CounterTile};
