import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {FadeOutDown} from 'react-native-reanimated';
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
  OptionsButton,
  ActionButtonContainer,
  ActionButtonsContainer,
  EditingCounterText,
} from './styles';
import {
  ActionButtonProps,
  AdjustButtonProps,
  CounterTileProps,
  CounterValueProps,
  OptionsButtonProps,
  TileTitleProps,
} from './types';
import {OptionsIcon} from '../../assets/static/options';
import {ActionMinusIcon} from '../../assets/static/action_minus';
import {ActionPlusIcon} from '../../assets/static/action_plus';

const TileTitle: React.FC<TileTitleProps> = memo(({title}) => {
  return (
    <TileTitleContainer>
      <IconContainer>
        <HashIcon autoPlay />
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

const EditingCounterValue: React.FC<CounterValueProps> = memo(
  ({value, format}) => {
    return (
      <EditingCounterText adjustsFontSizeToFit numberOfLines={1}>
        {value}
      </EditingCounterText>
    );
  },
);

const AdjustButton: React.FC<AdjustButtonProps> = memo(
  ({onChangeButtonPress}) => {
    const iconRef = useRef<BaseAnimatedIconRef>(null);

    const handleChangeButtonPress = () => {
      iconRef?.current?.play();
      onChangeButtonPress();
    };

    return (
      <ButtonContainer exiting={FadeOutDown.duration(300)}>
        <Button onPress={handleChangeButtonPress} hitSlop={20}>
          <AdjustIcon ref={iconRef} autoPlay />
        </Button>
      </ButtonContainer>
    );
  },
);

const MoreOptionsButton: React.FC<OptionsButtonProps> = memo(
  ({onOptionsButtonPress}) => {
    return (
      <ButtonContainer>
        <OptionsButton onPress={onOptionsButtonPress} hitSlop={20}>
          <OptionsIcon />
        </OptionsButton>
      </ButtonContainer>
    );
  },
);

const DecrementButton: React.FC<ActionButtonProps> = memo(({onAction}) => {
  return (
    <ActionButtonContainer onPress={onAction}>
      <ActionMinusIcon />
    </ActionButtonContainer>
  );
});

const IncrementButton: React.FC<ActionButtonProps> = memo(({onAction}) => {
  return (
    <ActionButtonContainer onPress={onAction}>
      <ActionPlusIcon />
    </ActionButtonContainer>
  );
});

const EDITING_TIMEOUT_MS = 7000;

const CounterTile: React.FC<CounterTileProps> = memo(
  ({title, value, format}) => {
    const [isEditing, setEditing] = useState(false);

    const idleTime = useRef<NodeJS.Timeout>();

    const startCloseEditingTimeout = useCallback(() => {
      idleTime.current = setTimeout(() => {
        idleTime.current = undefined;
        setEditing(false);
      }, EDITING_TIMEOUT_MS);
    }, []);

    const handleChangeButtonPress = useCallback(() => {
      console.log('handleChangeButtonPress');
      startCloseEditingTimeout();
      setEditing(toggle);
    }, [startCloseEditingTimeout]);

    useEffect(() => console.log({isEditing}), [isEditing]);

    return (
      <Tile
        onStartShouldSetResponderCapture={() => {
          if (idleTime.current) {
            clearTimeout(idleTime.current);
            startCloseEditingTimeout();
          }
          return false;
        }}>
        <ReplacebleContainer visible={!isEditing}>
          <TileTitle title={title} />
          <CounterValue value={value} format={format} />
          <AdjustButton onChangeButtonPress={handleChangeButtonPress} />
        </ReplacebleContainer>

        <EditingContainer visible={isEditing}>
          <MoreOptionsButton
            onOptionsButtonPress={() => console.log('More options Button')}
          />
          <EditingCounterValue value={value} format={format} />
          <ActionButtonsContainer>
            <DecrementButton onAction={() => console.log('Decrement')} />
            <IncrementButton onAction={() => console.log('Increment')} />
          </ActionButtonsContainer>
        </EditingContainer>
      </Tile>
    );
  },
);

export {CounterTile};
