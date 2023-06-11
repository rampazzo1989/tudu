import React, {memo, useCallback, useRef} from 'react';
import {AdjustIcon} from '../animated-icons/adjust-icon';
import {BaseAnimatedIconRef} from '../animated-icons/animated-icon/types';
import {HashIcon} from '../animated-icons/hash-icon';
import {
  ButtonContainer,
  Button,
  CounterText,
  IconContainer,
  Tile,
  TileTitleContainer,
  Title,
} from './styles';
import {
  AdjustButtonProps,
  CounterTileProps,
  CounterValueProps,
  TileTitleProps,
} from './types';

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

const AdjustButton: React.FC<AdjustButtonProps> = memo(
  ({onChangeButtonPress}) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    const handleChangeButtonPress = () => {
      iconRef?.current?.play();
      onChangeButtonPress();
    };

    return (
      <ButtonContainer>
        <Button onPress={handleChangeButtonPress} hitSlop={5}>
          <AdjustIcon ref={iconRef} />
        </Button>
      </ButtonContainer>
    );
  },
);

const CounterTile: React.FC<CounterTileProps> = memo(
  ({title, value, format}) => {
    const handleChangeButtonPress = useCallback(() => {
      console.log('handleChangeButtonPress');
    }, []);

    return (
      <Tile>
        <TileTitle title={title} />
        <CounterValue value={value} format={format} />
        <AdjustButton onChangeButtonPress={handleChangeButtonPress} />
      </Tile>
    );
  },
);

export {CounterTile};
