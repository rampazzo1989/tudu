import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {FadeOut, SlideInUp} from 'react-native-reanimated';
import {toggle} from '../../utils/state-utils';
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
  ReplacebleContainer,
  EditingContainer,
} from './styles';
import {
  AdjustButtonProps,
  CounterTileProps,
  CounterValueProps,
  TileTitleProps,
} from './types';
import Animated from 'react-native-reanimated';

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
        <Button onPress={handleChangeButtonPress} hitSlop={20}>
          <AdjustIcon ref={iconRef} />
        </Button>
      </ButtonContainer>
    );
  },
);

const CounterTile: React.FC<CounterTileProps> = memo(
  ({title, value, format}) => {
    const [isEditing, setEditing] = useState(false);

    const handleChangeButtonPress = useCallback(() => {
      console.log('handleChangeButtonPress');
      setEditing(toggle);
    }, []);

    useEffect(() => console.log({isEditing}), [isEditing]);

    return (
      <Tile>
        <ReplacebleContainer visible={!isEditing}>
          <TileTitle title={title} />
          <CounterValue value={value} format={format} />
        </ReplacebleContainer>

        <EditingContainer visible={isEditing}>
          <CounterValue value={value} format={format} />
        </EditingContainer>

        <AdjustButton onChangeButtonPress={handleChangeButtonPress} />
      </Tile>
    );
  },
);

export {CounterTile};
